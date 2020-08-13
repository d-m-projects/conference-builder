import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../../contexts/Program";

import * as dates from "date-arithmetic";
import moment from "moment";

// antd components
import { Form, Input, Button, DatePicker, Skeleton } from "antd";
import Fade from "react-reveal/Fade";

const { RangePicker } = DatePicker;

const CreateProgram = ({ formNext }) => {
	const program = useContext(ProgramContext);
	const { createProgram } = program;
	
	const onFinish = (values) => {
		const newProgram = {
			current: program.current,
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
		formNext();
	};

	program.programLength =
		program.dateStart
			? [moment(program.dateStart), moment(program.dateEnd)]
			: [moment.calendar, moment.calendar]

	return (
		<>
			{program.dateStart
				? <Fade><Form name="basic" onFinish={onFinish} initialValues={program}>
					<Form.Item
						label="Program Name"
						name="name"
						rules={[{ required: true, message: "Please input a valid name." }]}>
						<Input />
					</Form.Item>

					<Form.Item
						label="Program Length"
						name="programLength"
						rules={[{ required: true, message: "Please select a valid date range." }]}
					>
						<RangePicker />
					</Form.Item>

					<Form.Item>
						{
							program.dateStart
								? <Button type="primary" htmlType="submit" >Continue</Button>
								: <Button type="primary" htmlType="submit" shape="round">Create</Button>
						}
					</Form.Item>
				</Form ></Fade>
				: <Skeleton />
			}
		</>
	);
};

export default CreateProgram;
