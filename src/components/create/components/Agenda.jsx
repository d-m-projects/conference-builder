import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../../contexts/Program";

import * as dates from "date-arithmetic";
import moment from "moment";

// antd components
import { Form, Input, Button, DatePicker, Skeleton, Table } from "antd";
import Fade from "react-reveal/Fade";
import { agenda, modified } from "./events"

const { Column } = Table

const { RangePicker } = DatePicker;

const Agenda = ({ formNext }) => {
	/* 	const program = useContext(ProgramContext);
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
		}; */
	console.log(`Createor.jsx 35: `,)

	const Sessions = () => {
		console.log(`Createor.jsx 37: `,)
		const columns = [
			{ title: "Title", width: 200, dataIndex: "title", key: "title" },
			{ title: "Presenters", dataIndex: "presenters", key: "presenters" },
		]
		const data = [
			{ "key": 1, "title": "Tempsoft", "presenters": "Cariotta Frankish" },
			{ "key": 2, "title": "Y-find", "presenters": "Nikolos Yesenev" },
			{ "key": 3, "title": "Bitchip", "presenters": "Jessey Adin" },
			{ "key": 4, "title": "Bytecard", "presenters": "Doll Thirlwall" },
			{ "key": 5, "title": "Holdlamis", "presenters": "Fawne Paule" },
		]
		return <Table size={"small"} bordered columns={columns} dataSource={data} pagination={false} />;
	}

	const days = modified.days

	return (
		// <Fade>
		<Table dataSource={days}>
			<Column title="Date" dataIndex="date" key="date"
				render={(date, sessions) => (
					<>
						<p>{date, console.log(`Agenda.jsx 64: `, )}</p>
						{/* <Table dataSource={sessions}>
							<Column title="name" dataIndex="dateStart" key="id" />
						</Table> */}
						<Sessions />
					</>
				)}
			/>
		</Table>
		// </Fade>
	)
};

export default Agenda;



// ["Moss Jowling","Tera Faldoe","Hyacintha Quiddihy","Janine Laraway","Darryl Fardo","Niccolo Knill","Artemas Ramsby","Catarina Millington","Munroe Haskey","Phillipp Fyrth","Ricca Leary","Antonetta Fidelli","Oran Cawt","Susie Connett","Sibelle Mechic","Auria Lopes","Zola Lambdon","Emelina Bayston","Garrick Rolfini","Dael Collier"]
// ["Keylex","Toughjoyfax","Temp","Lotlux","Veribet","Keylex","Bitchip","Konklab","Cardguard","Voyatouch", "Ventosanzap","Sonair", "Daltfresh", "Redhold", "Quo Lux", "Transcof", "Viva", "Zaam-Dox", "Aerified", "Alpha",]

