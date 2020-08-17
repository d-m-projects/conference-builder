import React, { useContext } from "react";
import { ProgramContext } from "../../contexts/Program";

import * as dates from "date-arithmetic";
import moment from "moment";

import { Form, Input, Button, DatePicker } from "antd";
import "./styles.scss";

const { RangePicker } = DatePicker;

function ProgramForm() {
  const program = useContext(ProgramContext);
  const { createProgram } = program;

  const onFinish = (values) => {
    console.log("Form submit", values);

    const newProgram = {
      name: values.name,
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
  };

  return (
    <div className="form-container">
      <Form name="programForm" onFinish={onFinish} initialValues={program} layout="vertical">
        <Form.Item label="Program Name" name="name" rules={[{ required: true, message: "Please input a valid name." }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Program Start & End Dates"
          name="programLength"
          rules={[{ required: true, message: "Please select a valid date range." }]}>
          <RangePicker />
        </Form.Item>

        <Form.Item>
          {program.dateStart ? (
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" shape="round">
              Create
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default ProgramForm;
