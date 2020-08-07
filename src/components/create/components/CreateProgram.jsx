import React, { useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

import * as dates from "date-arithmetic";
import moment from "moment";

// antd components
import { Form, Input, Button, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const CreateProgram = ({ formNext }) => {
  const program = useContext(ProgramContext);

  const onFinish = (values) => {
    program.name = values.programName;
    program.dateStart = values.programLength[0]._d;
    program.dateEnd = values.programLength[1]._d;

    let current = program.dateStart;

    while (dates.lte(current, program.dateEnd, "day")) {
      program.days.push({ date: current, sessions: [] });
      current = dates.add(current, 1, "day");
    }

    formNext();
  };

  return (
    <Form name="basic" onFinish={onFinish}>
      <Form.Item
        label="Program Name"
        name="programName"
        rules={[{ required: true, message: "Please input a valid name." }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Program Length"
        name="programLength"
        rules={[{ required: true, message: "Please select a valid date range." }]}>
        <RangePicker />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" shape="round">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProgram;
