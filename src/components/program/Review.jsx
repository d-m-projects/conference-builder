import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// antd components
import { Skeleton, Card, List } from "antd";

// Components
import { VIEW } from "../forms/FormManager";

const getDraggableItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: 16,
	marginBottom: 4,

	// // change background colour if dragging
	// background: isDragging ? "lightgreen" : "white",
	// boxShadow: "0 0 3px 1px rgba(40, 40, 40, 0.35)",
	border: "1px solid #ddd",

	// // styles we need to apply on draggables
	...draggableStyle,
});

// This is the style for the container that holds the draggables
const getListStyle = () => ({
	// padding: 8,
	width: "100%",
});

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

	useEffect(() => {
		setDays(program.days)
	}, [program])

	const reorderDays = (list, startIndex, endIndex) => {
		// Swaps the days in the list
		// AND keeps the dates in the proper order.

		const result = Array.from(list)

		let alldates = []
		for (let i = 0; i < result.length; i++) {
			alldates.push(result.slice(i, i + 1)[0].date)
		}
		
		let bothdates = [result.slice(startIndex, startIndex+1)[0].date, result.slice(endIndex, endIndex+1)[0].date]

		// const x = 0
		// result[endIndex].date = bothdates[0]
		// result[startIndex].date = bothdates[1]

		const [removed] = result.splice(startIndex, 1)
		console.log(`Review.jsx 73: `, removed, result)
		result.splice(endIndex, 0, removed)
		return result
	}

	const onDragEnd = (e) => {
		// Dropped outside the list
		if (!e.destination) {
			return;
		}
		const orderedDays = reorderDays(days, e.source.index, e.destination.index);
		updateProgram({...program, days: orderedDays});
	};

	const programdata = (p) => {
		p.programDateString = `Program Day: ${moment(p.date).format("ddd, MMM Do Y")}`
		p.programToFrom = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		return p
	}

	return (
		program.dateStart
			? <Card title={program.name} extra={programdata(program).programToFrom} bodyStyle={{ display: "flex" }}>
				<DragDropContext
					// onBeforeCapture={onBeforeCapture}
					// onBeforeDragStart={onBeforeDragStart}
					// onDragStart={onDragStart}
					// onDragUpdate={onDragUpdate}
					onDragEnd={onDragEnd}
				>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}
							>
								{program.days.map((day, index) => (
									<Draggable key={day.date} draggableId={day.date} index={index}>
										{(provided, snapshot) => (
											<div className={`program-agenda`}
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}
											>
												<Sessions
													props={{ sessions: day.sessions, dayHeader: programdata(day).programDateString }}
												/>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
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
	return (
		<div>
			<h3>{props.dayHeader}</h3>
			{props.sessions.map((session, index) => (
				// <Draggable key={session.name} draggableId={session.name} index={index}>
				// 	{(provided, snapshot) => (
				<div key={index} style={{ marginLeft: "20px" }}
				// ref={provided.innerRef}
				// {...provided.draggableProps}
				// {...provided.dragHandleProps}
				// style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}
				>
					{/* <h3>Session: {session.name}</h3> */}
					<Presentations props={{ pres: session.presentations, sessionHeader: sessiondata(session).sessionsDateString }} />
				</div>
				// 	)}
				// </Draggable>
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
				// <Draggable key={pres.name} draggableId={pres.name} index={index}>
				// 	{(provided, snapshot) => (
				<div key={index} style={{ marginLeft: "20px" }}
				// ref={provided.innerRef}
				// {...provided.draggableProps}
				// {...provided.dragHandleProps}
				// 	style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}
				>
					<h4 style={{ fontStyle: "oblique" }}>Presentation: {pres.name}</h4>
					<p key={index}>By: {pres.presenters.join(", ")}</p>
				</div>
				// 	)}
				// </Draggable>
			))}
		</div>
	)
}

export default Review;
