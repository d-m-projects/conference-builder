import React, { useState, useContext } from "react";
import { ProgramContext } from "../../contexts/Program";

import { Form, Input, DatePicker, Button, message } from "antd";

import FlowSwitchOneModal from "../Modals/FlowSwitchOne/FlowSwitchOneModal";

const { RangePicker } = DatePicker;

function SessionForm(props) {
  const { setFormView } = props;

  const program = useContext(ProgramContext);
  const { createSession } = program;

  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  const formSubmit = (values) => {
    createSession({
      name: values.sessionName,

      // Store datetime as string, not instance of moment
      dateStart: values.sessionLength[0].second(0)._d,
      dateEnd: values.sessionLength[1].second(0)._d,

      presentations: [],
    });

    message.success(`Session ${values.sessionName} created!`);

    setTimeout(() => {
      setModalVisible(true);
    }, 200);

    form.resetFields();
  };

  return (
    <>
      <FlowSwitchOneModal isVisible={modalVisible} setVisibility={setModalVisible} setFormView={setFormView} />
      <div className="session-form-container">
        <Form
          form={form}
          name="sessionForm"
          className="session-form"
          onFinish={formSubmit}
          autoComplete="off"
          layout="vertical"
          hideRequiredMark>
          {/* SESSION NAME */}
          <Form.Item
            label="Session Name"
            name="sessionName"
            rules={[{ required: true, message: "Input a name for this session." }]}>
            <Input />
          </Form.Item>

          {/* DATETIME RANGE */}
          <Form.Item
            label="Session Start & End Dates"
            name="sessionLength"
            rules={[{ required: true, message: "Input a date range for this session." }]}>
            <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
          </Form.Item>

          {/* SUBMIT */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Session
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default SessionForm;
