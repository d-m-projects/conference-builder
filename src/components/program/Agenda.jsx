import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

import moment from "moment";

// antd components
import { Skeleton, Table, Card, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";

// Components
import FormManager, { VIEW } from "../forms/FormManager";
import ReorderDnD from "./AgendaForm/ReorderDnD";
import { newest, modified } from "../create/components/events"

// Dev test data
import injection from "../../data/testdata"


const { Column } = Table

const doReorder = (list) => {
	return list[1]
}

const Agenda = (props) => {
	// Top level of the agenda
	// concerned with `days` and passing down `sessions` nested data.

	// State for dynamic item list
	const [itemList, setItemList] = useState([]);

	// Drawer
	const [drawerVisible, setDrawerVisible] = useState(false);


	const location = useLocation()
	let { initialView } = props
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM

	console.log(`Agenda.jsx 18: `, props)

	const program = useContext(ProgramContext);

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	// if (!program.dateStart) {
	// 	program.injectTestData()
	// }

	const programdata = (p) => {
		const programDateString = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		return (
			<Button type="text" style={{ margin: 0, padding: 0 }}>{programDateString}</Button>
		)
	}

	const reorderClick = (list, type) => {
		const x = doReorder(list)
		// create program.updatesession
	}

	return (
		program.dateStart
			? <Card title={program.name} extra={programdata(program)}>
				<Table className="program-agenda" showHeader={false} size="small" dataSource={program.days} pagination={false} key={moment().unix()}>
					<Column title="Date" dataIndex="date" key={moment().unix()}
						render={(dataIndex, singleDay, i) => (
							<>
								<Space size={16}>
									<p>Program Day: {moment(dataIndex).format("ddd, MMM Do Y")}</p>
									{/* <Button size="small" ><UnorderedListOutlined /></Button> */}
								</Space>
								<Sessions key={moment().unix()}
									props={singleDay}
									visible={drawerVisible}
									setVisible={setDrawerVisible}
									itemList={itemList}
									setItemList={setItemList}
									reorderClick={reorderClick}
								/>
							</>
						)}
					/>
				</Table>
			</Card>

			: <Skeleton />
	)
};

const Sessions = ({ props }) => {
	// 2nd level. descendent of `days`.
	// concerned with `sessions` and passing down `presentations` nested data.

	const { visible, setVisible, presenters, setPresenters, reorderClick } = props;

	const sessiondata = (s) => {
		s.sessionsDateString = `${s.name} (${moment(s.dateStart).format("HH:mm")}-${moment(s.dateEnd).format("HH:mm")})`
		return s
	}

	return (
		<Table className="program-session" showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={props.sessions} pagination={false} key={moment().unix()}>
			<Column title="Session Name" dataIndex="dateStart" key={moment().unix()}
				render={(dataIndex, single, i) => (
					<>
						<Space size={16}>
							<p>Session: {sessiondata(single).sessionsDateString}</p>
							<Button size="small" onClick={() => reorderClick(single.presentations)}><UnorderedListOutlined /></Button>
						</Space>
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
		<Table className={`program-presentation`} showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={props.presentations} pagination={false} key={moment().unix()}>
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
