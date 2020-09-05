import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { useHistory } from "react-router-dom";

import moment from "moment";

import PresenterDnD from "./PresenterDnD";
import PresenterInput from "./PresenterInput";
import CreditInput from "./CreditInput";

import { Row, Col, Divider, Skeleton } from "antd";
import { Form, Input, Button, DatePicker, message } from "antd";

const { RangePicker } = DatePicker;

function PresentationForm(props) {
  const { initialFormMode, initialFormValues, setModalVisible } = props;

  const program = useContext(ProgramContext);
  const { selectedSessionId, getSessionById, createPresentation, editPresentation } = program;
  console.log("Session Selected", selectedSessionId);

  const history = useHistory();

  // "add" / "edit"
  const [formMode, setFormMode] = useState(initialFormMode);

  // State for dynamic presenters
  const [presenters, setPresenters] = useState(
    initialFormValues && initialFormValues.presenters ? initialFormValues.presenters : []
  );

  // State for dynamic credits
  const [credits, setCredits] = useState(
    initialFormValues && initialFormValues.credits ? initialFormValues.credits : {}
  );

  // Friendly strings for list to render credits
  const [creditsList, setCreditsList] = useState(
    initialFormValues && initialFormValues.creditsList ? initialFormValues.creditsList : []
  );

  // DnD Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [form] = Form.useForm();

  // Input prefill
  const [prefillValues, setPrefillValues] = useState({});

  useEffect(() => {
    if (initialFormValues) {
      setPrefillValues({
        ...initialFormValues,
        presentationLength: [
          moment(initialFormValues.presentationLength[0]),
          moment(initialFormValues.presentationLength[1]),
        ],
      });
    }
  }, [initialFormValues]);

  useEffect(() => {
    form.resetFields();
  }, [formMode, prefillValues]);

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
        if (formMode === "edit") {
          editPresentation(selectedSessionId, {
            id: initialFormValues.id,
            name: values.presentationName,
            dateStart: start._d,
            dateEnd: end._d,
            presenters: presenters.map((presenter) => presenter.name),
            credits: credits,
          });

          message.success(`Presentation ${values.presentationName} modified!`);

          // TEMP
          history.push("/review");
        } else {
          createPresentation(selectedSessionId, {
            name: values.presentationName,
            dateStart: start._d,
            dateEnd: end._d,
            presenters: presenters.map((presenter) => presenter.name),
            credits: credits,
          });

          message.success(`Presentation ${values.presentationName} created!`);
        }

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

    if (session) {
      return date.isBefore(session.dateStart, "day") || date.isAfter(session.dateEnd, "day");
    }
  };

  /* FORM FIELD REQUIREMENTS
    Presentation Name
    DateTime start / end
    Presenters * Dynamic, Add presenter btn, Re-order presenters dnd
    Credit Type + Credit Value * Dynamic, Add credit btn
  */

  return selectedSessionId >= 0 ? (
    <div className="presentation-form-container">
      <PresenterDnD
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        presenters={presenters}
        setPresenters={setPresenters}
      />

      <Form
        form={form}
        name="presentationForm"
        initialValues={prefillValues}
        onFinish={formSubmit}
        autoComplete="off"
        hideRequiredMark>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Presentation Name"
              labelCol={{ span: 24 }}
              name="presentationName"
              rules={[{ required: true, message: "Input a name for this presentation." }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              label="Presentation Start & End Times"
              labelCol={{ span: 24 }}
              name="presentationLength"
              rules={[{ required: true, message: "Input a time range for this presentation." }]}>
              <RangePicker
                disabledDate={disabledDate}
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                minuteStep={5}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <PresenterInput
          parentForm={form}
          presenters={presenters}
          setPresenters={setPresenters}
          setDrawerVisible={setDrawerVisible}
        />

        <Divider />

        <CreditInput
          parentForm={form}
          credits={credits}
          setCredits={setCredits}
          creditsList={creditsList}
          setCreditsList={setCreditsList}
        />

        <Divider />

        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {formMode === "edit" ? "Edit Presentation" : "Add Presentation"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  ) : (
    <Skeleton />
  );
}

export default PresentationForm;
