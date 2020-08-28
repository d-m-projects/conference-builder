import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

// antd components
import { Skeleton, Card, List } from "antd";

// Components
import { VIEW } from "../forms/FormManager";

// modules
import moment from "moment";
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
// import localizer from 'react-big-calendar/lib/localizers/globalize'
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const localizer = momentLocalizer(moment)
const Review = (props) => {
	// Top level of the Review
	// Renders `Days` and passes down `Sessions` with nested data.

	const [RBCdata, setRBCdata] = useState([])
	const program = useContext(ProgramContext);
	const { updateProgram } = program

	const [startDate, setStartDate] = useState("")

	const location = useLocation()
	let { initialView } = props
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	// if (!program.dateStart) {
	// 	program.injectTestData()
	// }

	// buildData(program)
	// console.log(`treedata: `, treeData)


	const programdata = (p) => {
		p.programDateString = `Program Day: ${moment(p.date).format("ddd, MMM Do Y")}`
		p.programToFrom = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		return p
	}

	useEffect(() => {
		setRBCdata(buildData(program))
		setStartDate(new Date(program.dateStart))
	}, [program])

	return (
		Boolean(RBCdata)  // if this is an array.length 0, it will be `false`
			? <Calendar
				events={RBCdata}
				localizer={localizer}
				defaultView={"day"}
				date={startDate}
				views={["week", "day", "agenda"]}
			/>
			: <Skeleton />
		// <div>{console.log(`Review.jsx 58: `, RBCdata, program.dateStart)}</div>
	)
};

const Sessions = ({ props }) => {
	// 2nd level. descendent of `days`.
	// concerned with `sessions` and passing down `presentations` nested data.

	const sessiondata = (s) => {
		s.sessionsDateString = `${s.name} Session (${moment(s.dateStart).format("HH:mm")}-${moment(s.dateEnd).format("HH:mm")})`
		return s
	}
	return (
		<div>
			<h3>{props.dayHeader}</h3>
			{props.sessions.map((session, index) => (
				<div key={index} style={{ marginLeft: "20px" }}>
					<Presentations props={{ pres: session.presentations, sessionHeader: sessiondata(session).sessionsDateString }} />
				</div>
			))}

		</div>
	)
}

const Presentations = ({ props }) => {
	// 3rd level. descendent of `sessions`.
	// concerned with `presentations` nested data.
	return (
		<div>
			<h4>{props.sessionHeader}</h4>
			{props.pres.map((pres, index) => (
				<div key={index} style={{ marginLeft: "20px" }}>
					<h4 style={{ fontStyle: "oblique" }}>Presentation: {pres.name}</h4>
					<p key={index}>By: {pres.presenters.join(", ")}</p>
				</div>
			))}
		</div>
	)
}

const buildData = (obj) => {
	if (!obj.dateStart) {
		return
	}
	let data = [];
	let id = 0
	for (let day of obj.days) {
		for (let s of day.sessions) {
			data.push({
				id: id,
				title: s.name,
				start: new Date(s.dateStart),
				end: new Date(s.dateEnd),
			})
			id++
			for (let p of s.presentations) {
				data.push({
					id: id,
					title: p.name,
					start: new Date(p.dateStart),
					end: new Date(p.dateEnd),
					credits: p.credits,
					presenters: p.presenters,
				})
				id++
			}
		}
	}
	return data
}

export default Review;
