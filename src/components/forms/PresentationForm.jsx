import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../contexts/Program";

import moment from "moment";

import FlowSwitchTwoModal from "../Modals/FlowSwitchTwo/FlowSwitchTwoModal";

import { Form, Input, Button, DatePicker, Select, message } from "antd";
// import "./styles.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

function PresentationForm(props) {
  const { setFormView } = props;

  const program = useContext(ProgramContext);
  const {
    selectedSessionId,
    getSessionById,
    createPresentation,
    addGlobalPresenter,
    deleteGlobalPresenter,
    globalPresenters,
  } = program;

  // State for dynamic presenters
  const [presenters, setPresenters] = useState([]);

  // State for dynamic credits
  const [creditTypes, setCreditTypes] = useState([]);
  const [creditAmounts, setCreditAmounts] = useState([]);

  // Friendly strings for list to render credits
  const [credits, setCredits] = useState([]);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  // List data render handling
  useEffect(() => {
    // Additionally clear input
    form.setFieldsValue({ presenter: "" });

    form.setFieldsValue({ presenterList: presenters });
  }, [presenters]);

  useEffect(() => {
    // Additionally clear inputs
    form.setFieldsValue({
      creditType: "",
      creditAmount: 0,
    });

    form.setFieldsValue({ creditList: credits });
  }, [credits]);

  const validPresentationDateRange = (start, end) => {
    const session = getSessionById(selectedSessionId);

    if (start.isBefore(moment(session.dateStart)) || end.isAfter(moment(session.dateEnd))) {
      return false;
    }
    return true;
  };

  const formSubmit = (values) => {
    if (presenters.length === 0) {
      form.setFields([
        {
          name: "presenterList",
          errors: ["Must have atleast 1 presenter."],
        },
      ]);
    } else if (credits.length === 0) {
      form.setFields([
        {
          name: "creditList",
          errors: ["Must have atleast 1 credit type added."],
        },
      ]);
    } else {
      const start = values.presentationLength[0].second(0).millisecond(0);
      const end = values.presentationLength[1].second(0).millisecond(0);

      if (validPresentationDateRange(start, end)) {
        createPresentation(selectedSessionId, {
          name: values.presentationName,
          dateStart: start._d,
          dateEnd: end._d,
          presenters: presenters,
          creditTypes: creditTypes,
          creditAmounts: creditAmounts,
        });

        message.success(`Presentation ${values.presentationName} created!`);

        setTimeout(() => {
          setModalVisible(true);
        }, 200);

        // Clear form data and old state
        setCredits([]);
        setPresenters([]);
        form.resetFields();
      } else {
        message.error("Presentation date range is outside the bounds of current session.", 5);

        form.setFields([
          {
            name: "presentationLength",
            errors: ["Date range outside bounds of current session."],
          },
        ]);
      }
    }
  };

  const addPresenter = () => {
    /*
      1. Any presenter not in global list will be added automatically.
      2. Adds to local presenter list for this presentation.
    */
    if (form.getFieldValue("presenter")) {
      const newPresenter = form.getFieldValue("presenter");

      addGlobalPresenter(newPresenter);

      setPresenters([...presenters, newPresenter]);
    }
  };

  const removePresenter = (values) => {
    /*
      1. Finds and removes presenter from local list.
      2. Removes from global presenter list ONLY if it isn't being used elsewhere.
    */
    const presenter = presenters.filter((p) => !values.includes(p))[0];

    deleteGlobalPresenter(presenter);

    setPresenters(values);
  };

  const addCredit = () => {
    // HELPER FUNCS
    const clearErrors = () => {
      form.setFields([
        {
          name: "creditType",
          errors: [],
        },
        {
          name: "creditAmount",
          errors: [],
        },
      ]);
    };

    const creditType = form.getFieldValue("creditType");
    const creditAmount = form.getFieldValue("creditAmount");

    if (creditType && creditAmount) {
      clearErrors();

      setCreditTypes([...creditTypes, creditType]);
      setCreditAmounts([...creditAmounts, creditAmount]);

      setCredits([...credits, `${creditType} | ${creditAmount}`]);
    } else {
      form.setFields([
        {
          name: "creditType",
          errors: ["Required to add a credit to presentation."],
        },
        {
          name: "creditAmount",
          errors: ["Required to add a credit to presentation."],
        },
      ]);
    }
  };

  const removeCredit = (values) => {
    setCredits(values);
  };

  /* FORM FIELD REQUIREMENTS
    Presentation Name
    DateTime start / end
    Presenters * Dynamic, Add presenter btn
    Credit Type + Credit Value * Dynamic, Add credit btn
  */

  return (
    <>
      <FlowSwitchTwoModal isVisible={modalVisible} setVisibility={setModalVisible} setFormView={setFormView} />
      <div className="presentation-form-container">
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
            <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
          </Form.Item>

          {/* PRESENTER LIST */}
          <Form.Item label="Current Presenter List" name="presenterList">
            <Select
              mode="multiple"
              onChange={removePresenter}
              placeholder="Presenters previously used can be selected here.">
              {globalPresenters.map((presenter, idx) => {
                return (
                  <Option key={idx} value={presenter}>
                    {presenter}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* PRESENTER INPUT */}
          <Form.Item label="Presenter" name="presenter">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="button" onClick={addPresenter}>
              Add Presenter
            </Button>
          </Form.Item>

          {/* CREDIT LIST */}
          <Form.Item label="Current Credits" name="creditList">
            <Select mode="multiple" onChange={removeCredit} placeholder="Credits will display here as they are added.">
              {credits.map((credit, idx) => {
                return (
                  <Option key={idx} value={credit}>
                    {credit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* CREDIT TYPE / AMOUNT INPUTS */}
          <Form.Item label="Credit Type" name="creditType">
            <Input />
          </Form.Item>
          <Form.Item label="Credit Amount" name="creditAmount">
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="button" onClick={addCredit}>
              Add Credit
            </Button>
          </Form.Item>

          {/* SUBMIT */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Presentation
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default PresentationForm;
