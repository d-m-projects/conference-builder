import React, { useState, useEffect, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { Modal, Form, Input, Button, Space, TimePicker, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

// Modifies form behavior
const ModalMode = {
  EDIT: 1,
  ADD: 0,
};

function SessionModal({ mode, visible, setVisible, addSession, editSession, session = null }) {
  const program = useContext(ProgramContext);
  const { tempSession } = program;

  const [formPrefillData, setFormPrefillData] = useState({});

  // Preload form inputs if edit mode enabled
  useEffect(() => {
    if (mode === ModalMode.EDIT) {
      setFormPrefillData({
        sessionName: session.title,
        presentations: session.presentations.length > 0 ? session.presentations : [],
      });
    }
  }, [session]);

  function onFinish(values) {
    let completeSession = {
      title: values.sessionName,
      start: tempSession.start,
      end: tempSession.end,
      presentations: values.presentations ? values.presentations : [],
    };

    if (mode === ModalMode.EDIT) {
      completeSession = {
        ...completeSession,
        start: session.start,
        end: session.end,
        id: session.id,
      };

      editSession(completeSession);

      message.success(`Session: "${completeSession.title}" modified.`);
    } else {
      addSession(completeSession);

      message.success(`Session: ${completeSession.title} created.`);
    }

    setVisible(false);
  }

  function handleCancel() {
    setVisible(false);
  }

  return (
    <Modal
      visible={visible}
      title={mode === ModalMode.ADD ? "Create new session" : "Modify existing session"}
      onCancel={handleCancel}
      footer={[null]}
      destroyOnClose={true}>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        layout={"vertical"}
        preserve={false}
        initialValues={formPrefillData}>
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

export { ModalMode };
export default SessionModal;
