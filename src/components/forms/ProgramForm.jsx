import React, { useContext } from "react";
import { ProgramContext } from "../../contexts/Program";

import * as dates from "date-arithmetic";

import { VIEW } from "./FormManager";

import { Form, Input, Button, DatePicker, message } from "antd";
// import "./styles.scss";

const { RangePicker } = DatePicker;

function ProgramForm(props) {
  const { setFormView } = props;

  const program = useContext(ProgramContext);
  const { createProgram } = program;

  const onFinish = (values) => {
    const newProgram = {
      name: values.programName,
      dateStart: values.programLength[0].second(0).millisecond(0)._d,
      dateEnd: values.programLength[1].second(0).millisecond(0)._d,
      days: [],
    };

    let current = newProgram.dateStart;

    while (dates.lt(current, newProgram.dateEnd, "day")) {
      newProgram.days.push({ date: current, sessions: [] });
      current = dates.add(current, 1, "day");
    }

    // Fix for last date time
    newProgram.days.push({ date: newProgram.dateEnd, sessions: [] });

    createProgram(newProgram);

    setFormView(VIEW.SESSION);

    message.success(`Program '${values.programName}' created!`);
  };

  return (
    <Form name="programForm" onFinish={onFinish} initialValues={program} layout="vertical" hideRequiredMark>
      <Form.Item
        label="Program Name"
        name="programName"
        rules={[{ required: true, message: "Input a valid name for this program." }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Program Start & End Dates"
        name="programLength"
        rules={[{ required: true, message: "Input a date range for this program." }]}>
        <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={5} />
      </Form.Item>

      <Form.Item>
        {program.dateStart ? (
          <Button type="primary" htmlType="submit">
            Continue
          </Button>
        ) : (
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

export default ProgramForm;
