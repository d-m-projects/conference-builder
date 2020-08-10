import React, { useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import * as dates from "date-arithmetic";
import moment from "moment";
import db from "../../../data/database";

// antd components
import { Form, Input, Button, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const CreateProgram = ({ formNext }) => {
  const program = useContext(ProgramContext);
  const { createProgram } = program;

  const onFinish = (values) => {
    const newProgram = {
      name: values.programName,
      dateStart: moment(values.programLength[0]._d).set("hour", 0).set("minute", 0).set("second", 0)._d,
      dateEnd: moment(values.programLength[1]._d).set("hour", 0).set("minute", 0).set("second", 0)._d,
      days: [],
    };

    let current = newProgram.dateStart;

    while (dates.lte(current, newProgram.dateEnd, "day")) {
      newProgram.days.push({ date: current, sessions: [] });
      current = dates.add(current, 1, "day");
    }

    createProgram(newProgram);

    // db.insert(program)
    // .then((id) => {
    // 	console.log(`CreateProgram.jsx 29: id `, id)
    // })

    formNext();
  };

  return (
    <Form name="basic" onFinish={onFinish}>
      <Form.Item
        label="Program Name"
        name="programName"
        rules={[{ required: true, message: "Please input a valid name." }]}>
        <Input defaultValue = {program.name || ""}/>
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
