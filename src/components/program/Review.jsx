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


const getDraggableItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: 16,
	marginBottom: 16,

	// change background colour if dragging
	background: isDragging ? "lightgreen" : "white",
	boxShadow: "0 0 3px 1px rgba(40, 40, 40, 0.35)",

	// styles we need to apply on draggables
	...draggableStyle,
});

// This is the style for the container that holds the draggables
const getListStyle = () => ({
	padding: 8,
	width: "100%",
});

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
		console.log(`cap: `, e)
	};
	const onBeforeDragStart = (e) => {
		console.log(`prestart: `, e)
	};
	const onDragStart = (e) => {
		console.log(`start: `, e)
	};
	const onDragUpdate = (e) => {
		console.log(`update: `, e)
	};
	const onDragEnd = (e) => {
		console.log(`end: `, e)
	};

	const programdata = (p) => {
		p.programDateString = `Program Day: ${moment(p.date).format("ddd, MMM Do Y")}`
		p.programToFrom = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		return p
	}

	return (
		program.dateStart
			? <Card title={program.name} extra={programdata(program).programToFrom}>
				<DragDropContext
					onBeforeCapture={onBeforeCapture}
					onBeforeDragStart={onBeforeDragStart}
					onDragStart={onDragStart}
					onDragUpdate={onDragUpdate}
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
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}
											>
												<Sessions
													className="program-agenda"
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
			<div>{props.dayHeader}</div>
			{props.sessions.map((session, index) => (
				<Draggable key={session.name} draggableId={session.name} index={index}>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}
						>
							<Presentations className={`program-session`} props={{ pres: session.presentations, sessionHeader: sessiondata(session).sessionsDateString }} />
						</div>
					)}
				</Draggable>
			))}

		</div>
	)
}

const Presentations = ({ props }) => {
	// 3rd level. descendent of `sessions`.
	// concerned with `presentations` nested data.
	return (
		<div>
			{props.pres.map((pres, index) => (
				<Draggable key={pres.name} draggableId={pres.name} index={index}>
					{(provided, snapshot) => (
						<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
							style={getDraggableItemStyle(snapshot.isDragging, provided.draggableProps.style)}
							>
							<div className={`program-presentation`} key={index}>{pres.name}</div>
						</div>
					)}
				</Draggable>
			))}
		</div>
	)
}

export default Review;
