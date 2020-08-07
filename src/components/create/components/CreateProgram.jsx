import React, { useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

import moment from "moment";
import db from "../../../data/database"

// antd components
import { Form, Input, Button, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const CreateProgram = ({ formNext }) => {
  const program = useContext(ProgramContext);

  const onFinish = (values) => {
    console.log("Success:", values);

    program.Name = values.programName;
    program.DateStart = values.programLength[0]._d;
    program.DateEnd = values.programLength[1]._d;
	const send = {
		name: program.Name,
		dateStart: program.DateStart,
		dateEnd: program.DateEnd,
		days: program.Days
	}
	db.insert(send)
	.then((id) => {
		console.log(`CreateProgram.jsx 29: id `, id);
	})
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
