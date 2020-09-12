import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import moment from "moment";

import { exportProgramToFile, copyProgramToClipboard } from "../file/yamlOperations";

import db from "../../data/database";

// antd components
import { message, Card, Button, Modal, List, Skeleton, Tooltip} from "antd";
import {
	EditOutlined,
	DownloadOutlined,
	CopyOutlined,
	DeleteTwoTone,
	ExclamationCircleOutlined,
	PlusOutlined
} from "@ant-design/icons";

// Components
import { VIEW } from "../forms/FormManager";
import ProgramModal from "../Modals/ProgramModal";

const { confirm } = Modal;

const File = () => {
	const program = useContext(ProgramContext);
	const { loadProgram } = program;

	const history = useHistory();

	const [fileman, setFileman] = useState([]);
	const [deleted, setDeleted] = useState(false); // reload database when a program is deleted
	const [creatorVisible, setCreatorVisible] = useState(false); // show the create program modal

	const doCreateProgram = () => {
		setCreatorVisible(true)
	}

	const doEditClick = async (id) => {
		await loadProgram(id);
		history.push("/review", { initialView: VIEW.REVIEW });
	};

	const doDelete = (props) => {
		console.log(`Request to delete program from DB: `, props.name, props);

		const ModalDeleteText = (props) => {
			return (
				<>
					<p>
						You are about to delete this program and all associated data. This is{" "}
						<em>
							<strong>irreversible!</strong>
						</em>
					</p>
					<p>Are you sure?</p>
					<Card title={props.item.name}>
						<p>Begin: {moment(props.item.dateStart).format("ddd, MMM Do Y")}</p>
						<p>End: {moment(props.item.dateEnd).format("ddd, MMM Do Y")}</p>
					</Card>
				</>
			);
		};

		confirm({
			title: "Delete this program?",
			icon: <ExclamationCircleOutlined />,
			content: <ModalDeleteText item={props} />,
			okText: "Delete",
			okType: "danger",
			cancelText: "Cancel",
			onOk() {
				message.info(`Program '${props.name}' deleted!`);
				db.delete(props.id);
				setDeleted(true);
			},
			onCancel() {
				console.log(`Delete Request CANCELLED.`);
			},
		});
	};

	const getall = async () => {
		let ret = await db.readAll();
		ret.sort((x, y) => (x.dateStart > y.dateStart ? 1 : -1));
		setDeleted(false);
		setFileman([...ret]);
	};

	useEffect(() => {
		getall();
	}, []);

	useEffect(() => {
		getall();
	}, [deleted]);

	return fileman ? (
		<>
			<ProgramModal visible={creatorVisible} setVisible={setCreatorVisible} />
			<List
				header={
					<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
						<h3>All Programs</h3>
						<Button style={{ float: "right" }} type="primary" htmlType="submit" shape="round"
							onClick={doCreateProgram}
						>
							<PlusOutlined />
						Create
					</Button>
					</div>
				}
				bordered
				// size="large"
				dataSource={fileman}
				renderItem={item => (
					<List.Item
						actions={[
              <Tooltip title="Edit Program">
							  <EditOutlined onClick={() => doEditClick(item.id)} />
              </Tooltip>,
							<Tooltip title="Export program to file">
                <DownloadOutlined onClick={() => exportProgramToFile(item.id)} />
              </Tooltip>,
              <Tooltip title="Copy program to clipboard">
							  <CopyOutlined onClick={() => copyProgramToClipboard(item.id)} />
              </Tooltip>,
              <Tooltip title="Delete program">
							  <DeleteTwoTone onClick={() => doDelete(item)} twoToneColor="red" />
              </Tooltip>
            ]}
					>
						<List.Item.Meta
							title={item.name}
							description={
								<p>{moment(item.dateStart).format("ddd, MMM Do Y")} - {moment(item.dateEnd).format("ddd, MMM Do Y")}
									<br />
									{item.nextSessionId} Sessions, {item.nextPresentationId} Presentations, {item.nextPresenterId} Presenters
							</p>
							}
						/>
					</List.Item>
				)}
			/>
		</>
	) : (
		<Skeleton />
	);
};

export default File;