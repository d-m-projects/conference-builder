import React, { useState, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import moment from "moment";

import { Modal, Space } from "antd";
import { Form, Input, DatePicker, Button, Popconfirm } from "antd";

const { RangePicker } = DatePicker;

function EditProgramModal(props) {
  const { visible, setVisible } = props;

  const program = useContext(ProgramContext);
  const { editProgram } = program;

  const [rangeCondition, setRangeCondition] = useState(true);
  const [popVisible, setPopVisible] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = () => {
    // Executes via popover
    // Runs the editProgram func
    const { programName, programLength } = form.getFieldsValue(["programName", "programLength"]);

    editProgram({
      programName,
      programLength: [programLength[0]._d, programLength[1]._d],
    });
  };

  const checkRange = (range) => {
    // onChange of RangePicker -> If date range would remove existing days with sessions
    // then popover will show up if edit button is clicked. Otherwise the edit button will
    // work normally and popover won't show up

    // Start date same or before program date
    // End date same or after program date
    // If so then we don't need to delete any existing days, so no popconfirm dialog

    if (range[0].isSameOrBefore(program.dateStart, "minute") && range[1].isSameOrAfter(program.dateEnd, "minute")) {
      setRangeCondition(true);
    } else {
      setRangeCondition(false);
    }
  };

  const handlePopVis = (visible) => {
    if (!visible) {
      setPopVisible(visible);
      return;
    }

    // Condition to show popconfirm
    if (rangeCondition) {
      handleSubmit();
    } else {
      setPopVisible(visible);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal closable title={`Edit program "${program.name}"`} visible={visible} onCancel={handleClose} footer={[]}>
      <Form
        form={form}
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
          <RangePicker onChange={checkRange} showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
        </Form.Item>

        <Space size={16}>
          <Popconfirm
            title="Date range selected may result in sessions / presentations being deleted, continue anyway?"
            visible={popVisible}
            onVisibleChange={handlePopVis}
            onConfirm={handleSubmit}
            onCancel={() => setPopVisible(false)}
            okText="Yes"
            cancelText="No">
            <Button type="primary" htmlType="submit">
              Edit Program
            </Button>
          </Popconfirm>
          <Button type="primary" htmlType="button" onClick={handleClose}>
            Cancel
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

export default EditProgramModal;
