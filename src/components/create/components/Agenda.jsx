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


const Presentations = ({ presentations }) => {
	// 3rd level. descendent of `sessions`.
	// concerned with `presentations` nested data.

	// console.log(`Agenda.jsx 19: `, presentations)

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
		<Table showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={presentations.presentations} pagination={false} key={moment().unix()}>
			<Column title="Presentation" dataIndex="name" key="name" key={moment().unix()} />
		</Table>
	)
}

const Sessions = ({ sessions }) => {
	// 2nd level. descendent of `days`.
	// concerned with `sessions` and passing down `presentations` nested data.

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
		<Table showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={sessions.sessions} pagination={false} key={moment().unix()}>
			<Column title="Session Name" dataIndex="dateStart" key={moment().unix()}
				render={(dateStart, presentations) => (
					<>
						<p>{moment(dateStart).format("HH:mm")}</p>
						<Presentations presentations={presentations} key={moment().unix()} />
					</>
				)}
			/>
		</Table>
	)
}

const Agenda = ({ formNext }) => {
	// Top level of the agenda
	//  concerned with `days` and passing down `sessions` nested data.

	return (
		// <Fade>
		<Table showHeader={false} size="small" dataSource={modified.days} pagination={false} key={moment().unix()}>
			<Column title="Date" dataIndex="date" key={moment().unix()}
				render={(date, sessions) => (
					<>
						<p>{moment(date).format("ddd, MMM Do Y")}</p>
						<Sessions sessions={sessions} key={moment().unix()} />
					</>
				)}
			/>
		</Table>
		// </Fade>
	)
};

export default Agenda;
