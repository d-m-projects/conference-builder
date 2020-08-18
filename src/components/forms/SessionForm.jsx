import React, { useContext } from "react";
import { ProgramContext } from "../../contexts/Program";

import { Form, Input, DatePicker, Button } from "antd";

const { RangePicker } = DatePicker;

function SessionForm() {
  const program = useContext(ProgramContext);
  const { createSession } = program;

  const [form] = Form.useForm();

  const formSubmit = (values) => {
    createSession({
      name: values.sessionName,
      // Store datetime as string, not instance of moment
      dateStart: values.sessionLength[0].second(0)._d,
      dateEnd: values.sessionLength[1].second(0)._d,
    });

    form.resetFields();
  };

  return (
    <div className="session-form-container">
      <Form
        form={form}
        name="sessionForm"
        className="session-form"
        onFinish={formSubmit}
        autoComplete="off"
        layout="vertical">
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
          <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        {/* SUBMIT */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Session
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SessionForm;
