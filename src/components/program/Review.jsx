import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation, useHistory } from "react-router-dom";

// antd components
import { Row, Col, Space, Divider, Skeleton, Card, List, Popconfirm, message, Tooltip, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Components
import { VIEW } from "../forms/FormManager";
import Agenda from "./Agenda";

// modules
import moment from "moment";
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

// vars
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

function CustomEvent({ event }) {
	const program = useContext(ProgramContext);
	const { selectSession, deleteSession, deletePresentation, getNextPresenterId } = program;

	const history = useHistory();

	const handleDelete = (event) => {
		event.type === "session" ? deleteSession(event.id) : deletePresentation(event.id);

		message.success(`${event.title} deleted!`)
	}

	const handleEdit = (event) => {
		if (event.type === "session") {
			selectSession(event.id);

			const initialFormValues = {
				sessionName: event.title,
				sessionLength: [event.start, event.end]
			}

			history.push("/program", {
				initialView: VIEW.SESSION,
				initialFormMode: "edit",
				initialFormValues
			});

		} else {
			// console.log(event)

			const presenters = [];
			let pId = getNextPresenterId();

			event.presenters.forEach(presenter => {
				presenters.push({ name: presenter, id: String(pId) });
				pId++;
			})

			const creditList = [];
			for (const key in event.credits) {
				creditList.push(`${key} | ${event.credits[key]}`)
			}

			const initialFormValues = {
				id: event.id,
				presentationName: event.title,
				presentationLength: [event.start, event.end],
				presenters: presenters,
				credits: event.credits,
				creditsList: creditList
			}

			history.push("/program", {
				initialView: VIEW.PRESENTATION,
				initialFormMode: "edit",
				initialFormValues
			});
		}
	}

	return (
		<>
			<span className="event-card-widgets">
				<Popconfirm
					title={`Are you sure you want to delete this ${event.type === "session" ? "session" : "presentation"}?`}
					onConfirm={() => handleDelete(event)}
					okText="Yes"
					cancelText="No">
					<Tooltip title={event.type === "session" ? "Delete Session" : "Delete Presentation"}>
						<DeleteOutlined />
					</Tooltip>
				</Popconfirm>
				<Tooltip title={event.type === "session" ? "Edit Session" : "Edit Presentation"}>
					<EditOutlined onClick={() => handleEdit(event)} />
				</Tooltip>
			</span>
			<span>{event.title}</span>
		</>
	)
}

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

	console.log(`Review.jsx 35: `, program.id)

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	if (!program.dateStart) {
		program.injectTestData()
	}

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
		<>
			<Row>
				<Col span={24}>
					<Agenda props={program} />
				</Col>
			</Row>
			<Divider />
			<Row>
				<Col span={24}>
					<Space>
						<Button type="primary">Add Session</Button>
						<Button type="primary">Add Presentation</Button>
						<Button type="primary">Edit Program Name / Date Range</Button>
					</Space>
				</Col>
			</Row>
		</>
	)

	/* 	return (
			Boolean(RBCdata)  // if this is an array.length 0, it will be `false`
				? <>
					<Row>
						<Col span={24}>
							<DragAndDropCalendar
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
								components={{
									event: CustomEvent,
								}}
							/>
						</Col>
					</Row>
	
					<Divider />
	
					<Row>
						<Col span={24}>
							<Space>
								<Button type="primary">Add Session</Button>
								<Button type="primary">Add Presentation</Button>
								<Button type="primary">Edit Program Name / Date Range</Button>
							</Space>
						</Col>
					</Row>
				</Agenda>
				: <Skeleton />
		) */
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
				id: s.id,
				title: s.name,
				start: new Date(s.dateStart),
				end: new Date(s.dateEnd),
				type: "session",
				origIndex: { dayIndex: i, sessionIndex: j },
				origData: { dayId: day.id, sessionId: s.id },
			})
			id++
			for (let [k, p] of s.presentations.entries()) {
				data.push({
					id: p.id,
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

export default Review;
