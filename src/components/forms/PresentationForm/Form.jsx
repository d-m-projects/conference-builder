import React, { useState, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import moment from "moment";

import PresenterDnD from "./PresenterDnD";
import PresenterInput from "./PresenterInput";
import CreditInput from "./CreditInput";

import { Form, Input, Button, DatePicker, message } from "antd";

const { RangePicker } = DatePicker;

function PresentationForm(props) {
  const { setModalVisible } = props;

  const program = useContext(ProgramContext);
  const { selectedSessionId, getSessionById, createPresentation } = program;

  // State for dynamic presenters
  const [presenters, setPresenters] = useState([]);

  // State for dynamic credits
  const [credits, setCredits] = useState({});

  // Friendly strings for list to render credits
  const [creditsList, setCreditsList] = useState([]);

  // Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [form] = Form.useForm();

  const formSubmit = (values) => {
    // Date range validation helper func
    const isValidPresentationDateRange = (start, end) => {
      const session = getSessionById(selectedSessionId);

      if (start.isBefore(session.dateStart) || end.isAfter(session.dateEnd)) {
        return false;
      }
      return true;
    };

    // Error handling for select inputs on form submit
    // We need 1 presenter and 1 credit type minimum
    if (presenters.length === 0) {
      form.setFields([
        {
          name: "presenterList",
          errors: ["Must have atleast 1 presenter."],
        },
      ]);
    } else if (Object.keys(credits).length === 0) {
      form.setFields([
        {
          name: "creditList",
          errors: ["Must have atleast 1 credit type added."],
        },
      ]);
    } else {
      // Use mix of form data & state from inputs to create a new presentation
      const start = values.presentationLength[0].second(0).millisecond(0);
      const end = values.presentationLength[1].second(0).millisecond(0);

      if (isValidPresentationDateRange(start, end)) {
        createPresentation(selectedSessionId, {
          name: values.presentationName,
          dateStart: start._d,
          dateEnd: end._d,
          presenters: presenters.map((presenter) => presenter.name),
          credits: credits,
        });

        message.success(`Presentation ${values.presentationName} created!`);

        setTimeout(() => {
          setModalVisible(true);
        }, 200);

        // Clear form data and old state in case user wants to add another presentation
        setCredits({});
        setPresenters([]);
        setCreditsList([]);

        form.resetFields();
      } else {
        const { dateStart, dateEnd } = getSessionById(selectedSessionId);

        const sessionStart = moment(dateStart).format("HH:mm");
        const sessionEnd = moment(dateEnd).format("HH:mm");

        message.error(`Presentation time range must be between ${sessionStart}-${sessionEnd}`, 5);

        form.setFields([
          {
            name: "presentationLength",
            errors: [`Time selected outside range of session (${sessionStart}-${sessionEnd})`],
          },
        ]);
      }
    }
  };

  const disabledDate = (date) => {
    const session = getSessionById(selectedSessionId);

    return date.isBefore(session.dateStart, "day") || date.isAfter(session.dateEnd, "day");
  };

  /* FORM FIELD REQUIREMENTS
    Presentation Name
    DateTime start / end
    Presenters * Dynamic, Add presenter btn, Re-order presenters dnd
    Credit Type + Credit Value * Dynamic, Add credit btn
  */

  return (
    <div className="presentation-form-container">
      {/* DnD Presenter Drawer */}
      <PresenterDnD
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        presenters={presenters}
        setPresenters={setPresenters}
      />
      {/* THE BIG FORM */}
      <Form
        form={form}
        name="presentationForm"
        initialValues={{
          creditAmount: 0,
        }}
        onFinish={formSubmit}
        autoComplete="off"
        layout={"vertical"}
        hideRequiredMark>
        {/* PRESENTATION NAME */}
        <Form.Item
          label="Presentation Name"
          name="presentationName"
          rules={[{ required: true, message: "Input a name for this presentation." }]}>
          <Input />
        </Form.Item>

        {/* PRESENTATION TIME RANGE */}
        <Form.Item
          label="Presentation Start & End Times"
          name="presentationLength"
          rules={[{ required: true, message: "Input a time range for this presentation." }]}>
          <RangePicker
            disabledDate={disabledDate}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            minuteStep={5}
          />
        </Form.Item>

        {/* PRESENTER SUB-COMPONENT */}
        <PresenterInput
          parentForm={form}
          presenters={presenters}
          setPresenters={setPresenters}
          setDrawerVisible={setDrawerVisible}
        />

        {/* CREDIT SUB-COMPONENT */}
        <CreditInput
          parentForm={form}
          credits={credits}
          setCredits={setCredits}
          creditsList={creditsList}
          setCreditsList={setCreditsList}
        />

        {/* SUBMIT */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Presentation
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default PresentationForm;
