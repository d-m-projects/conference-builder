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
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

// vars
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

// Work
const Review = (props) => {
	// Top level of the Review
	// Renders `Days` and passes down `Sessions` with nested data.

	const [RBCdata, setRBCdata] = useState([])
	const program = useContext(ProgramContext);
	const { handleDnd } = program

	const [draggedEvent, setDraggedEvent] = useState({})

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

	const eventPropGetter = (e) => {
		if (e.type === "session") {
			return {
				style: {
					backgroundColor: "#ffffcc",
					color: "#444",
				},
			};
		}
	}

	useEffect(() => {
		setRBCdata(buildData(program))  // for doc on this setState, see buildData() at the bottom of this file.
		// setStartDate(new Date(program.dateStart))
	}, [program])

	return (
		Boolean(RBCdata)  // if this is an array.length 0, it will be `false`
			? <DragAndDropCalendar
				events={RBCdata}
				localizer={localizer}
				defaultView={"day"}
				defaultDate={new Date(program.dateStart)}
				views={["week", "day", "agenda"]}

				eventPropGetter={eventPropGetter}
				selectable
				resizable
				popup={true}
				onDragStart={e => handleDnd("onDragStart", e)}
				onEventDrop={e => handleDnd("onEventDrop", e)}
				onEventResize={e => handleDnd("onEventResize", e)}
				onSelectSlot={e => handleDnd("onSelectSlot", e)}
				handleDragStart={e => handleDnd("handleDragStart", e)}
			/>
			: <Skeleton />
	)
};

const buildData = (obj) => {
	// from the original `program` object, 
	// build an array of objects that is shaped specifically for
	// react-big-calendar

	if (!obj.dateStart) {
		return
	}
	let data = [];
	let id = 0
	for (let [i, day] of obj.days.entries()) {
		for (let [j, s] of day.sessions.entries()) {
			data.push({
				id: id,
				title: s.name,
				start: new Date(s.dateStart),
				end: new Date(s.dateEnd),
				type: "session",
				origIndex: {day: i, session: j},
				origData: { dayId: day.id, sessionId: s.id },
			})
			id++
			for (let [k, p] of s.presentations.entries()) {
				data.push({
					id: id,
					title: p.name,
					start: new Date(p.dateStart),
					end: new Date(p.dateEnd),
					credits: p.credits,
					presenters: p.presenters,
					type: "presentation",
					origIndex: { dayIndex: i, sessionIndex: j, presIndex: k },
					origData: { dayId: day.id, sessionId: s.id, presentationId: p.id },
				})
				id++
			}
		}
	}

	return data
}

const isBetween = (compare, start, end) => {
	// all args are dates
	// checks if `compare` date isBetween `start` date and `end` date
	// using js Date.getTime() (unix timestamp)
	// returns boolean

	compare = new Date(compare).getTime
	start = new Date(start).getTime
	end = new Date(end).getTime

	console.log(`Review.jsx 115: `, compare, start, end)

	if (compare <= end && compare >= start) {
		return true
	}
	return false
}

export default Review;
