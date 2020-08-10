import React, { useState, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { Modal, Form, Input, Button, Space, TimePicker, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function AddSessionModal({ visible, setVisible, addSession }) {
  // TODO on form input change, store in tempSession object in context so we can restore later if needed
  const program = useContext(ProgramContext);
  const { tempSession } = program;

  const onFinish = (values) => {
    // console.log("Received values of form:", values);

    addSession({
      title: values.sessionName,
      start: tempSession.start._d,
      end: tempSession.end._d,
      presentations: values.presentations,
    });

    setVisible(false);

    message.success("New session added.");
  };

  function handleSubmit() {
    setVisible(false);
  }

  function handleCancel() {
    setVisible(false);
  }

  return (
    <Modal visible={visible} title={"Create new session"} onOk={handleSubmit} onCancel={handleCancel} footer={[null]}>
      <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" layout={"vertical"}>
        <Form.Item
          label="Session Name"
          name="sessionName"
          rules={[{ required: true, message: "Please input a name for this session!" }]}>
          <Input />
        </Form.Item>

        <Form.List name="presentations">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => (
                  <Space key={field.key}>
                    <Form.Item
                      {...field}
                      name={[field.name, "presentationName"]}
                      fieldKey={[field.fieldKey, "presentationName"]}
                      rules={[{ required: true, message: "Missing presentation name" }]}>
                      <Input placeholder="Presentation title" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "startTime"]}
                      fieldKey={[field.fieldKey, "startTime"]}
                      rules={[{ required: true, message: "Missing start time" }]}>
                      <TimePicker />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "endTime"]}
                      fieldKey={[field.fieldKey, "endTime"]}
                      rules={[{ required: true, message: "Missing end time" }]}>
                      <TimePicker />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "presenterName"]}
                      fieldKey={[field.fieldKey, "presenterName"]}
                      rules={[{ required: true, message: "Missing presenter name" }]}>
                      <Input placeholder="Presenter's name" style={{ width: "60%" }} />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block>
                    <PlusOutlined /> Add presentation
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddSessionModal;
