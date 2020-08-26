import React, { useContext, useState, useEffect, ReactDOM } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// antd components
import { Skeleton, Table, Card, Button, List } from "antd";
import { newest, modified } from "../create/components/events"

// Components
import FormManager, { VIEW } from "../forms/FormManager";

// Dev test data
import injection from "../../data/testdata"


const { Column } = Table

const Review = (props) => {
	// Top level of the Review
	// Renders `Days` and passes down `Sessions` with nested data.
	const location = useLocation()
	let { initialView } = props
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM

	const program = useContext(ProgramContext);

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	// if (!program.dateStart) {
	// 	program.injectTestData()
	// }

	const onBeforeCapture = (e) => {
		console.log(`Review.jsx 39: `, e)
	};
	const onBeforeDragStart = (e) => {
		console.log(`Review.jsx 42: `, e)
	};
	const onDragStart = (e) => {
		console.log(`Review.jsx 45: `, e)
	};
	const onDragUpdate = (e) => {
		console.log(`Review.jsx 48: `, e)
	};
	const onDragEnd = (e) => {
		console.log(`Review.jsx 51: `, e)
	};

	const programdata = (p) => {
		p.programDateString = `Program Day: ${moment(p.date).format("ddd, MMM Do Y")}`
		p.programToFrom = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		return p
	}

	return (
		program.dateStart
			? <Card title={program.name} extra={programdata(program).programToFrom}>
				{program.days.map(day => (
					<Sessions className="program-agenda" props={{ sessions: day.sessions, dayHeader: programdata(day).programDateString }} />
				))}
			</Card>
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
	console.log(`Review.jsx 99: `, props)
	return (
		<>
			<div>{props.dayHeader}</div>
			{props.sessions.map( session => (
				<Presentations className={`program-session`} props={{ pres: session.presentations, sessionHeader: sessiondata(session).sessionsDateString }} />
			))}
		</>
		// <List
		// 	size="small"
		// 	dataSource={props.sessions}
		// 	header={props.dayHeader}
		// 	renderItem={session => (
		// 		<List.Item>
		// 			<List.Item.Meta
		// 				description={<Presentations className={`program-session`} props={{ pres: session.presentations, sessionHeader: sessiondata(session).sessionsDateString }} />}
		// 			/>
		// 		</List.Item>
		// 	)}
		// />
	)
}

const Presentations = ({ props }) => {
	// 3rd level. descendent of `sessions`.
	// concerned with `presentations` nested data.

	return (
		<List
			size="small"
			dataSource={props.pres}
			header={props.sessionHeader}
			renderItem={pres => (
				<List.Item>
					<List.Item.Meta
						description={<div className={`program-presentation`}>{pres.name}</div>}
					/>
				</List.Item>
			)}
		/>
	)
}

export default Review;
