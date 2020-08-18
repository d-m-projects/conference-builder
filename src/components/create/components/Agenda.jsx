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


const Presentations = ({ presentations}) => {
	console.log(`Agenda.jsx 19: `, presentations)
	
	const columns = [
		// would it be easier to do columns like this?
		// instead of imported JSX components?
		{
			title: "Presentation",
			dataIndex: "name",
			key: "name"
		},
	]

	return (
		<Table style={{ marginLeft: "20px" }} dataSource={presentations.presentations} pagination={false}>
			<Column title="Presentation" dataIndex="name" key="name" />
		</Table>
	)
}

const Sessions = ({ sessions }) => {
	console.log(`Agenda.jsx 37: `, sessions)

	const columns = [
		// would it be easier to do columns like this?
		// instead of imported JSX components?
		{
			title: "Session Name",
			dataIndex: "name",
			key: "id"
		},
		
	]
	
	return (
		<Table style={{ marginLeft: "20px" }} dataSource={sessions.sessions} pagination={false}>
			<Column title="Session Name" dataIndex="name" key="id"
				render={(date, presentations) => (
					<>
						<p>{date}</p>
						<Presentations presentations={presentations} />
					</>
				)}
				/>
		</Table>
	)
}

const Agenda = ({ formNext }) => {

	return (
		// <Fade>
		<Table dataSource={modified.days} pagination={false}>
			<Column title="Date" dataIndex="date" key="date"
				render={(date, sessions) => (
					<>
						<p>{date}</p>
						<Sessions sessions={sessions} />
					</>
				)}
			/>
		</Table>
		// </Fade>
	)
};

export default Agenda;

// const Sessions = () => {
// 	console.log(`Createor.jsx 37: `,)
// 	const columns = [
// 		{ title: "Title", width: 200, dataIndex: "title", key: "title" },
// 		{ title: "Presenters", dataIndex: "presenters", key: "presenters" },
// 	]
// 	const data = [
// 		{ "key": 1, "title": "Tempsoft", "presenters": "Cariotta Frankish" },
// 		{ "key": 2, "title": "Y-find", "presenters": "Nikolos Yesenev" },
// 		{ "key": 3, "title": "Bitchip", "presenters": "Jessey Adin" },
// 		{ "key": 4, "title": "Bytecard", "presenters": "Doll Thirlwall" },
// 		{ "key": 5, "title": "Holdlamis", "presenters": "Fawne Paule" },
// 	]
// 	return <Table size={"small"} bordered columns={columns} dataSource={data} pagination={false} />;
// }

