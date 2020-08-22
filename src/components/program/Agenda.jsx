import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

import moment from "moment";

// antd components
import { Skeleton, Table } from "antd";
import { newest, modified } from "../create/components/events"

// Components
import FormManager, { VIEW } from "../forms/FormManager";

// Dev test data
import injection from "../../data/testdata"

const { Column } = Table

const Agenda = (props) => {
	// Top level of the agenda
	// concerned with `days` and passing down `sessions` nested data.
	const location = useLocation()
	let {initialView} = props
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM

	console.log(`Agenda.jsx 18: `, props)

	const program = useContext(ProgramContext);

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	if (!program.dateStart) {
		program.injectTestData()
	}

	const programdata = (p) => {
		p.programDateString = `(${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")})`
		return p
	}

	return (
		program.dateStart
			? <>
				<p>Program Name: {program.name}</p>
				<p>{programdata(program).programDateString}</p>
				<Table showHeader={false} size="small" dataSource={program.days} pagination={false} key={moment().unix()}>
					<Column title="Date" dataIndex="date" key={moment().unix()}
						render={(dataIndex, singleDay, i) => (
							<>
								<p>Program Day: {moment(dataIndex).format("ddd, MMM Do Y")}</p>
								<Sessions props={singleDay} key={moment().unix()} />
							</>
						)}
					/>
				</Table>
			</>

			: <Skeleton />
	)
};

const Sessions = ({ props }) => {
	// 2nd level. descendent of `days`.
	// concerned with `sessions` and passing down `presentations` nested data.

	const sessiondata = (s) => {
		s.sessionsDateString = `${s.name} (${moment(s.dateStart).format("HH:mm")}-${moment(s.dateEnd).format("HH:mm")})`
		return s
	}

	return (
		<Table showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={props.sessions} pagination={false} key={moment().unix()}>
			<Column title="Session Name" dataIndex="dateStart" key={moment().unix()}
				render={(dataIndex, single, i) => (
					<>
						<p>Session: {sessiondata(single).sessionsDateString}</p>
						<Presentations props={single} key={moment().unix()} />
					</>
				)}
			/>
		</Table>
	)
}

const Presentations = ({ props }) => {
	// 3rd level. descendent of `sessions`.
	// concerned with `presentations` nested data.

	return (
		<Table showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={props.presentations} pagination={false} key={moment().unix()}>
			<Column title="Presentation" dataIndex="name" key="name" key={moment().unix()}
				render={(dataIndex, single, i) => (
					<>
						<div>Presentation: {single.name}</div>
						<div>By: {single.presenters.join(", ")}</div>
					</>
				)}
			/>
		</Table>
	)
}

export default Agenda;
