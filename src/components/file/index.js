import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

// antd components
import { Row, Col, DatePicker, message, Card, Form, Input, Space, Button, Modal } from "antd";
import { EditOutlined, DownloadOutlined, DoubleRightOutlined, CopyOutlined, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';

import * as dates from "date-arithmetic";
import moment from "moment";
import db from "../../data/database"

import { VIEW } from "../forms/FormManager";

import YAML from "yaml";
import FileSaver from "file-saver";

const { Meta } = Card
const { RangePicker } = DatePicker;
const { confirm } = Modal

const File = () => {
	const program = useContext(ProgramContext);
	const { loadProgram, createProgram } = program

	const history = useHistory()

	const [fileman, setFileman] = useState([]);
	const [deleted, setDeleted] = useState(false); // trigger useEffect rerender when a program is deleted

	const doEditClick = async (id) => {
		await loadProgram(id)
		history.push("/review", { initialView: VIEW.REVIEW });
	}

	const doDownloadClick = async (id) => {
		const dbProgramData = await db.read(id);
		const yamlProgram = YAML.stringify(dbProgramData);

		const yamlFile = new Blob([yamlProgram], { type: "text/yaml;charset=utf-8" });

		FileSaver.saveAs(yamlFile, `${dbProgramData.name}.yaml`);
	}

	const doCopyClick = async (id) => {
		const dbProgramData = await db.read(id);
		const yamlProgram = YAML.stringify(dbProgramData);

		navigator.clipboard.writeText(yamlProgram).then(() => {
			message.success("Program YAML copied to clipboard!");
		}, () => {
			message.error("Could not copy yaml program to clipboard, try another browser?");
		});
	}

	const doDelete = (props) => {
		console.log(`Request to delete program from DB: `, props.name, props)

		const ModalDeleteText = (props) => {
			return (
				<>
					<p>You are about to delete this program and all associated data. This is <em><strong>irreversible!</strong></em></p>
					<p>Are you sure?</p>
					<Card title={props.item.name}>
						<p>Begin: {moment(props.item.dateStart).format("ddd, MMM Do Y")}</p>
						<p>End: {moment(props.item.dateEnd).format("ddd, MMM Do Y")}</p>
					</Card>
				</>)
		}

		confirm({
			title: "Delete this program?",
			icon: <ExclamationCircleOutlined />,
			content: <ModalDeleteText item={props} />,
			okText: "Delete",
			okType: "danger",
			cancelText: "Cancel",
			onOk() {
				db.delete(props.id)
				setDeleted(true)
			},
			onCancel() {
				console.log(`Delete Request CANCELLED.`,)
			}
		})
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

	const getall = async () => {
		const defaultFileman = {
			name: "",
			dateStart: null,
			dateEnd: null,
		}
		let ret = await db.readAll()
		ret.sort((x, y) => (x.name > y.name) ? 1 : -1)
		setDeleted(false)
		setFileman([defaultFileman, ...ret])
	}

	useEffect(() => {
		getall()
	}, [])

	useEffect(() => {
		getall()
	}, [deleted])

	const CreateCard = () => {
		return (
			<Form onFinish={onFinish} key="0">
				<Card title="Create New Program" className="fileman-card" >
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

		<>
			<Row gutter={[10, 10]}>
				{fileman.map((item, i) =>
					<Col span={8} key={i}>
						{
							i === 0
								? <CreateCard />
								: <Card className="fileman-card" key={i}
									actions={[
										<EditOutlined onClick={() => doEditClick(item.id)} />,
										<DownloadOutlined onClick={() => doDownloadClick(item.id)} />,
										<CopyOutlined onClick={() => doCopyClick(item.id)} />,
									]}
									title={item.name}
									extra={<DeleteTwoTone onClick={() => doDelete(item)} twoToneColor="red" />}
								>
									<p>Begin: {moment(item.dateStart).format("ddd, MMM Do Y")}</p>
									<p>End: {moment(item.dateEnd).format("ddd, MMM Do Y")}</p>
									<p>{item.nextSessionId} Sessions, {item.nextPresentationId} Presentations,<br />{item.nextPresenterId} Presenters</p>
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