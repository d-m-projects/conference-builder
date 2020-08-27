import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

import moment from "moment";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// antd components
import { Skeleton, Card, List } from "antd";

// Components
import { VIEW } from "../forms/FormManager";

const Review = (props) => {
	// Top level of the Review
	// Renders `Days` and passes down `Sessions` with nested data.

	const program = useContext(ProgramContext);
	const { updateProgram } = program

	const [days, setDays] = useState(program.days)

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

	return (
		program.dateStart
			? <Card title={program.name} extra="program dates here" bodyStyle={{ display: "flex" }}>
				<div>
					{program.days.map((day, index) => (
						<div className={`program-agenda`}>
							<Sessions
								props={{ sessions: day.sessions, dayHeader: "single day date" }}
							/>
						</div>
					))}
				</div>
			</Card>
			: <Skeleton />
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

export default Review;
