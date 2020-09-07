import React, { useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import moment from "moment";

import { Modal, Space } from "antd";
import { Form, Input, DatePicker, Button } from "antd";

const { RangePicker } = DatePicker;

function EditProgramModal(props) {
  const { visible, setVisible } = props;

  const program = useContext(ProgramContext);
  const { editProgram } = program;

  const handleSubmit = (values) => {
    console.log("values", values);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal closable title={`Edit program "${program.name}"`} visible={visible} onCancel={handleClose} footer={[]}>
      <Form
        name="editProgramForm"
        initialValues={{
          programName: program.name,
          programLength: [moment(program.dateStart), moment(program.dateEnd)],
        }}
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
        hideRequiredMark>
        <Form.Item
          label="Program Name"
          name="programName"
          rules={[{ required: true, message: "Program must have a name." }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Program Start & End Dates"
          name="programLength"
          rules={[{ required: true, message: "Program must have a valid date range." }]}>
          <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
        </Form.Item>

        <Space size={16}>
          <Button type="primary" htmlType="submit">
            Edit Program
          </Button>
          <Button type="primary" htmlType="button" onClick={handleClose}>
            Cancel
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

export default EditProgramModal;
