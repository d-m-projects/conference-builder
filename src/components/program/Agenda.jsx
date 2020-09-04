import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation, useHistory } from "react-router-dom";

import moment from "moment";

// antd components
import { Skeleton, Table, Card, Button, Space, Popconfirm, message, Tooltip, Divider, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";

// Components
import FormManager, { VIEW } from "../forms/FormManager";
import ReorderDnD from "./AgendaForm/ReorderDnD";
import { newest, modified } from "../create/components/events"

// Dev test data
import injection from "../../data/testdata"

const { Column } = Table


function CustomEvent({ event, type }) {
	const program = useContext(ProgramContext);
	const { selectSession, deleteSession, deletePresentation, getNextPresenterId } = program;

	const history = useHistory();

	const handleDelete = (event, type) => {
		type === "session" ? deleteSession(event.id) : deletePresentation(event.id);

		message.success(`${event.name} deleted!`)
	}

	const handleEdit = (event, type) => {

		if (type === "session") {
			selectSession(event.id);

			const initialFormValues = {
				sessionName: event.name,
				sessionLength: [event.dateStart, event.dateEnd]
			}

			history.push("/program", {
				initialView: VIEW.SESSION,
				initialFormMode: "edit",
				initialFormValues
			});

		} else {
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
				presentationName: event.name,
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
		<Space>
			<Tooltip title={type === "session" ? `Edit Session ${event && event.name}` : `Edit Presentation ${event && event.name}`}>
				<EditOutlined onClick={() => handleEdit(event, type)} />
			</Tooltip>
			<Popconfirm
				title={`Are you sure you want to delete this ${type === "session" ? "session" : "presentation"}?`}
				onConfirm={() => handleDelete(event, type)}
				okText="Yes"
				cancelText="No">
				<Tooltip title={type === "session" ? `Delete Session ${event && event.name}` : `Delete Presentation ${event && event.name}`}>
					<DeleteOutlined />
				</Tooltip>
			</Popconfirm>

		</Space>
	)
}

const Agenda = (props) => {
	// Top level of the agenda
	// concerned with `days` and passing down `sessions` nested data.

	// State for dynamic item list
	const [itemList, setItemList] = useState([]);
	const [single, setSingle] = useState({});

	// Drawer
	const [drawerVisible, setDrawerVisible] = useState(false);

	const location = useLocation()
	let { initialView } = props
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM

	const program = useContext(ProgramContext);
	const { editSession } = program

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	// if (!program.dateStart) {
	// 	program.injectTestData()
	// }

	const doReorder = (list, one) => {
		setSingle(one)
		setItemList(list)
		setDrawerVisible(true)
	}

	const programdata = (p) => {
		const programDateString = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		return (
			<Button type="text" style={{ margin: 0, padding: 0 }}>{programDateString}</Button>
		)
	}

	return (
		program.dateStart
			? <>
				<ReorderDnD
					visible={drawerVisible}
					setVisible={setDrawerVisible}
					itemList={itemList}
					setItemList={setItemList}
					single={single}
				/>
				<Row>
					<Col span={24}>
						<Space>
							<Button type="primary">Add Session</Button>
							<Button type="primary">Add Presentation</Button>
							<Button type="primary">Edit Program Name / Date Range</Button>
						</Space>
					</Col>
				</Row>
				<Divider />
				<Card title={program.name} extra={programdata(program)}>
					<Table className="program-agenda" showHeader={false} size="small" dataSource={program.days} pagination={false}>
						<Column title="Date" dataIndex="date"
							render={(dataIndex, singleDay, i) => (
								<div key={i}>
									{/* {console.log(`Agenda.jsx 153: Day`, i)} */}
									<Space size={16}>
										<p>Program Day: {moment(dataIndex).format("ddd, MMM Do Y")}</p>
										<Tooltip title="Reorder Sessions">
											<UnorderedListOutlined onClick={() => doReorder(singleDay.sessions, singleDay)} />
										</Tooltip>
									</Space>
									<Sessions
										singleDay={singleDay}
										visible={drawerVisible}
										setVisible={setDrawerVisible}
										itemList={itemList}
										setItemList={setItemList}
										doReorder={doReorder}
									/>
									{(i + 1) >= (program.days.length) ? null : <Divider />}
								</div>
							)}
						/>
					</Table>
				</Card>
			</>

			: <Skeleton />
	)
};

const Sessions = ({ visible, setVisible, itemList, setItemList, doReorder, singleDay }) => {
	// 2nd level. descendent of `days`.
	// concerned with `sessions` and passing down `presentations` nested data.

	const sessiondata = (s) => {
		s.sessionsDateString = `${s.name} (${moment(s.dateStart).format("HH:mm")}-${moment(s.dateEnd).format("HH:mm")})`
		return s
	}
	// console.log(`Agenda.jsx 186: Session`, singleDay.id)
	return (
		<Table key={singleDay.id} className="program-session" showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={singleDay.sessions} pagination={false}>
			<Column title="Session Name" dataIndex="dateStart"
				render={(dataIndex, single, i) => (
					<div>
						<Space size={16}>
							<p>Session: {sessiondata(single).sessionsDateString}</p>
							<Tooltip title="Reorder Presentations">
								<UnorderedListOutlined onClick={() => doReorder(single.presentations, single)} />
							</Tooltip>
							<CustomEvent event={single} type={"session"} />
						</Space>
						<Presentations props={single} />
						<p>&nbsp;</p>
					</div>
				)}
			/>
		</Table>
	)
}

const Presentations = ({ props }) => {
	// 3rd level. descendent of `sessions`.
	// concerned with `presentations` nested data.

	const presdata = (p) => {
		p.presDateString = `[${moment(p.dateStart).format("HH:mm")}-${moment(p.dateEnd).format("HH:mm")}] ${p.name}`
		return p
	}
	// console.log(`Agenda.jsx 216: Pres`, props.id)
	return (
		<Table bordered key={props.id} className={`program-presentation`} showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={props.presentations} pagination={false}>
			<Column title="Presentation" dataIndex="name" key="name"
				render={(dataIndex, single, i) => (
					<div key={i}>
						<Space size="large">
							<span>{presdata(single).presDateString}</span><CustomEvent event={single} type="presentation" />
						</Space>
						<div>By: {single.presenters.join(", ")}</div>
					</div>
				)}
			/>
		</Table>
	)
}

export default Agenda;
