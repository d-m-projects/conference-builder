import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useLocation } from "react-router-dom";

import moment from "moment";

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

	const programdata = (p) => {
		p.programDateString = `Program Day: ${moment(p.date).format("ddd, MMM Do Y")}`
		console.log(`Review.jsx 39: `, p.programDateString)
		p.programToFrom = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`
		// title = {`Program Day: ${moment(day.date).format("ddd, MMM Do Y")}`}

		return p
	}

	return (
		program.dateStart
			? <Card title={program.name} extra={programdata(program).programToFrom}>
				<List
					dataSource={program.days}
					renderItem={day => (
						<List.Item>
							<List.Item.Meta
								title={programdata(day).programDateString}
								description={<Sessions props={day.sessions} />}
							/>
						</List.Item>
					)}
				/>
			</Card>

			// <Table className="program-agenda" showHeader={false} size="small" dataSource={program.days} pagination={false} key={moment().unix()}>
			// 	<Column title="Date" dataIndex="date" key={moment().unix()}
			// 		render={(dataIndex, singleDay, i) => (
			// 			<>
			// 				<p>Program Day: {moment(dataIndex).format("ddd, MMM Do Y")}</p>
			// 				<Sessions props={singleDay} key={moment().unix()} />
			// 			</>
			// 		)}
			// 	/>
			// </Table>

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

	console.log(`Review.jsx 84: `, props)

	return (
		<List
			dataSource={props.sessions}
			renderItem={session => (
				<List.Item>
					<List.Item.Meta
						title={`Session: ${sessiondata(session).sessionsDateString}`}
					// description={<Sessions props={day} />}
					/>
				</List.Item>
			)}
		/>

		// 	<Table className="program-session" showHeader={false} size="small" style={{ marginLeft: "20px" }} dataSource={props.sessions} pagination={false} key={moment().unix()}>
		// 	<Column title="Session Name" dataIndex="dateStart" key={moment().unix()}
		// 		render={(dataIndex, single, i) => (
		// 			<>
		// 				<p>Session: {sessiondata(single).sessionsDateString}</p>
		// 				<Presentations props={single} key={moment().unix()} />
		// 			</>
		// 		)}
		// 	/>
		// </Table>
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

export default Review;
