import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../../contexts/Program";

import * as dates from "date-arithmetic";
import moment from "moment";

// antd components
import { Form, Input, Button, DatePicker, Skeleton, Table } from "antd";
import Fade from "react-reveal/Fade";

const { RangePicker } = DatePicker;

const Createor = ({ formNext }) => {
	const program = useContext(ProgramContext);
	const { createProgram } = program;

	const onFinish = (values) => {
		// const newProgram = {
		// 	current: program.current,
		// 	name: values.name,
		// 	dateStart: moment(values.programLength[0]._d).set("hour", 0).set("minute", 0).set("second", 0)._d,
		// 	dateEnd: moment(values.programLength[1]._d).set("hour", 0).set("minute", 0).set("second", 0)._d,
		// 	days: [],
		// };

		// let current = newProgram.dateStart;

		// while (dates.lte(current, newProgram.dateEnd, "day")) {
		// 	newProgram.days.push({ date: current, sessions: [] });
		// 	current = dates.add(current, 1, "day");
		// }
		// createProgram(newProgram);
		formNext();
	};

	// const presentations = () => {
	// 	columns
	// }

	const sessions = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			render: text => <p>{text}</p>,
		},
		{
			title: 'Time',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: 'Session',
			dataIndex: 'session',
			key: 'session',
		},
	]

	const agenda = [
		{
			key: '1',
			date: "19-Oct-2020",
			time: "13:00",
			timeEnd: "14:00",
			event: "impactful",
			tags: ["Lebbie Theobalds", "Moss Jowling",],
		},
		{
			key: '2',
			date: "20-Oct-2020",
			time: "14:00",
			timeEnd: "15:00",
			event: "impactful",
			tags: ["Tera Faldoe", "Hyacintha Quiddihy", "Janine Laraway"],
		},
		{
			key: '3',
			date: "21-Oct-2020",
			time: "15:00",
			timeEnd: "13:00",
			event: "impactful",
			tags: ["Artemas Ramsby", "Catarina Millington",],
		},
	];

	return (
		// <Fade>
		<Table
			columns={sessions}
			dataSource={agenda} 
			size={"small"}
		/>
		// </Fade>
	)
};

export default Createor;


// ["Moss Jowling","Tera Faldoe","Hyacintha Quiddihy","Janine Laraway","Darryl Fardo","Niccolo Knill","Artemas Ramsby","Catarina Millington","Munroe Haskey","Phillipp Fyrth","Ricca Leary","Antonetta Fidelli","Oran Cawt","Susie Connett","Sibelle Mechic","Auria Lopes","Zola Lambdon","Emelina Bayston","Garrick Rolfini","Dael Collier"]
// ["Keylex","Toughjoyfax","Temp","Lotlux","Veribet","Keylex","Bitchip","Konklab","Cardguard","Voyatouch", "Ventosanzap","Sonair", "Daltfresh", "Redhold", "Quo Lux", "Transcof", "Viva", "Zaam-Dox", "Aerified", "Alpha",]