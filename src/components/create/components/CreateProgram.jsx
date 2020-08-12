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

		formNext();
	};

	const dateFormat = "ddd MMM D YYYY HH:mm:ss "
	// Wed Aug 19 2020 00:00:00 GMT-0500 (Central Daylight Time)

	return (
		<Form name="basic" onFinish={onFinish}>
			<Form.Item
				initialValue={program.name || ""}
				label="Program Name"
				name="programName"
				rules={[{ required: true, message: "Please input a valid name." }]}>
				<Input />
			</Form.Item>

			<Form.Item
				label="Program Length"
				name="programLength"
				rules={[{ required: true, message: "Please select a valid date range." }]}>
				<RangePicker
					defaultValue={program.dateStart
						? [moment(program.dateStart), moment(program.dateEnd)]
						: [moment.calendar, moment.calendar]
					}
				/>
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit" shape="round">
					Create
        </Button>
			</Form.Item>
		</Form >
	);
};

export default CreateProgram;
