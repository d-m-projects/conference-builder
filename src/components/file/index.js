import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

// antd components
import { Row, Col, DatePicker, message, Card, Form, Input, Space, Button } from "antd";
import { EditOutlined, DownloadOutlined, DoubleRightOutlined, CopyOutlined } from '@ant-design/icons';

import * as dates from "date-arithmetic";
import moment from "moment";
import db from "../../data/database"
// import data from "./data" // test data for scaffold

import FormManager, { VIEW } from "../forms/FormManager";

const { Meta } = Card
const { RangePicker } = DatePicker;

const File = () => {
	const [fileman, setFileman] = useState([

	])
	const program = useContext(ProgramContext);
	const { loadProgram, createProgram } = program
	const history = useHistory()

	const doEditClick = async (id) => {
		await loadProgram(id)
		history.push("/review", { initialView: VIEW.REVIEW });
	}

	const doDownloadClick = async (id) => {
		console.log(`index.js 28: download click id `, id)
	}

	const doYamlCopyClick = async (id) => {
		console.log(`index.js 28: download click id `, id)
	}

	const onFinish = async (values) => {
		console.log(`index.js 35: `, values)
		const newProgram = {
			name: values.programName,
			dateStart: values.programLength[0].second(0).millisecond(0)._d,
			dateEnd: values.programLength[1].second(0).millisecond(0)._d,
			days: [],
		};

		let current = newProgram.dateStart;

		while (dates.lte(current, newProgram.dateEnd, "day")) {
			newProgram.days.push({ date: current, sessions: [] });
			current = dates.add(current, 1, "day");
		}

		createProgram(newProgram);

		history.push("/program", { initialView: VIEW.SESSION })

		message.success(`Program '${values.programName}' Started!`);
	}

	useEffect(() => {
		const defaultFileman = {
			name: "",
			dateStart: null,
			dateEnd: null,
		}
		const getall = async () => {
			let ret = await db.readAll()
			ret.sort((x, y) => (x.name > y.name) ? 1 : -1)
			setFileman([defaultFileman, ...ret])
		}
		getall()
	}, [])

	const CreateCard = () => {
		return (
			<Form onFinish={onFinish}>
				<Card key="0" title="Create New Program" >
					<Space direction="vertical" >
						<Form.Item
							name="programName"
							rules={[{ required: true, message: "Please input a valid name." }]}>
							<Input placeholder="New Program Name" />
						</Form.Item>
						<Form.Item
							name="programLength"
							rules={[{ required: true, message: "Please select a valid date range." }]}
						>
							<RangePicker
								showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={15}
							/>
						</Form.Item>
						<Form.Item >
							<Button style={{ float: "right" }} type="primary" htmlType="submit" shape="round" >Create<DoubleRightOutlined /></Button>
						</Form.Item>

					</Space>
				</Card>
			</Form>
		)
	}

	return (
		// to flex column count responsively
		// https://usehooks.com/useMedia/
		<>
			<Row gutter={[10, 10]}>
				{fileman.map((item, i) =>
					<Col span={8} key={item.id}>
						{
							i === 0
								? <CreateCard />
								: <Card key={item.id}
									actions={[
										<EditOutlined onClick={() => doEditClick(item.id)} />,
										<DownloadOutlined onClick={() => doDownloadClick(item.id)} />,
										<CopyOutlined onClick={() => doDownloadClick(item.id)} />,
									]}
									title={item.name}
								>
									<p>Begin: {moment(item.dateStart).format("ddd, MMM Do Y")}</p>
									<p>End: {moment(item.dateEnd).format("ddd, MMM Do Y")}</p>
								</Card>
						}
					</Col>
				)}
			</Row>
		</>
	);
};

export default File;

// {/* {data.map( item => {
// 	<Card>{item.name}</Card>
// 	// <Card */}
// 	// >
// 	// </Card>
// // })}