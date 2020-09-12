import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../contexts/Program";

import { useHistory } from "react-router-dom";

import moment from "moment";

import { Form, Input, DatePicker, Button, message } from "antd";

import FlowSwitchOneModal from "../Modals/FlowSwitchOne/FlowSwitchOneModal";

const { RangePicker } = DatePicker;

function SessionForm(props) {
  const { initialFormMode, initialFormValues, setFormView } = props;

  const program = useContext(ProgramContext);
  const { createSession, editSession } = program;

  const history = useHistory();

  const [modalVisible, setModalVisible] = useState(false);

  const [prefillValues, setPrefillValues] = useState({});

  const [formMode, setFormMode] = useState(initialFormMode);

  const [form] = Form.useForm();

  useEffect(() => {
    if (initialFormValues) {
      setPrefillValues({
        ...initialFormValues,
        sessionLength: initialFormValues.sessionLength
          ? [moment(initialFormValues.sessionLength[0]), moment(initialFormValues.sessionLength[1])]
          : [],
      });
    }
  }, [initialFormValues]);

  useEffect(() => {
    form.resetFields();
  }, [form, formMode, prefillValues]);

  const getDateRange = () => {
    return form.getFieldValue("sessionLength");
  };

  const disabledDate = (date) => {
    return date.isBefore(program.dateStart, "day") || date.isAfter(program.dateEnd, "day");
  };

  const validSessionDateRange = (start, end) => {
    if (start.isSameOrAfter(program.dateStart) && end.isSameOrBefore(program.dateEnd)) {
      return true;
    }
    return false;
  };

  const formSubmit = (values) => {
    const start = values.sessionLength[0].second(0).millisecond(0);
    const end = values.sessionLength[1].second(0).millisecond(0);

    if (validSessionDateRange(start, end)) {
      if (formMode === "edit") {
        editSession(initialFormValues.sessionId, {
          name: values.sessionName,
          dateStart: start._d,
          dateEnd: end._d,
        });

        message.success(`Session ${values.sessionName} modified!`);

        history.push("/review");
      } else {
        createSession({
          name: values.sessionName,
          dateStart: start._d,
          dateEnd: end._d,
          presentations: [],
        });

        message.success(`Session ${values.sessionName} created!`);

        setTimeout(() => {
          setModalVisible(true);
        }, 200);
      }
    } else {
      const programStartTime = moment(program.dateStart).format("HH:mm");
      const programEndTime = moment(program.dateEnd).format("HH:mm");

      let fieldErrorText = [""];

      if (start.dayOfYear() === moment(program.dateStart).dayOfYear()) {
        // Session time starts before program starts :(
        message.error(`Session time must start on or after program start time (${programStartTime}).`, 5);

        fieldErrorText = [`Time selected is before program start time (${programStartTime})`];
      } else {
        // Session time exceeds program end time! Doh!
        message.error(`Session time must end on or before program end time (${programEndTime}).`, 5);

        fieldErrorText = [`Time selected is past program end time (${programEndTime})`];
      }

      form.setFields([
        {
          name: "sessionLength",
          errors: fieldErrorText,
        },
      ]);
    }
  };

  return (
    <>
      <FlowSwitchOneModal
        isVisible={modalVisible}
        setVisibility={setModalVisible}
        setFormView={setFormView}
        setFormMode={setFormMode}
        sessionLength={getDateRange()}
      />
      <div className="session-form-container">
        <Form
          form={form}
          name="sessionForm"
          className="session-form"
          onFinish={formSubmit}
          autoComplete="off"
          layout="vertical"
          hideRequiredMark
          initialValues={prefillValues}>
          <Form.Item
            label="Session Name"
            name="sessionName"
            rules={[{ required: true, message: "Input a name for this session." }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Session Start & End Dates"
            name="sessionLength"
            rules={[{ required: true, message: "Input a date range for this session." }]}>
            <RangePicker
              disabledDate={disabledDate}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              minuteStep={5}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {formMode === "edit" ? "Edit Session" : "Create Session"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default SessionForm;
