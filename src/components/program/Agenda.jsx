import React, { useState, useContext } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import moment from "moment";

// antd components
import { Skeleton, Table, Card, Space, Tooltip, Divider, ConfigProvider } from "antd";
import {
	PlusOutlined,
	UnorderedListOutlined,
	SettingOutlined,
	DownloadOutlined,
	CopyOutlined,
} from "@ant-design/icons";

// Components
import { VIEW } from "../forms/FormManager";
import ReorderDnD from "./AgendaForm/ReorderDnD";
import Sessions from "./Sessions";
import ProgramModal from "../Modals/ProgramModal";
import renderNoData from "../components/NoData"

import { formatDataSource } from "./formatDataSource";
import { exportProgramToFile, copyProgramToClipboard } from "../file/yamlOperations";

// Dev test data
// import injection from "../../data/testdata";

const { Column } = Table;

function Agenda() {
	// Top level of the agenda
	// concerned with `days` and passing down `sessions` nested data.

	const program = useContext(ProgramContext);

	const history = useHistory();

	// State for dynamic item list
	const [itemList, setItemList] = useState([]);
	const [single, setSingle] = useState({});

	// Drawer
	const [drawerVisible, setDrawerVisible] = useState(false);

	// Edit Program Modal
	const [modalVisible, setModalVisible] = useState(false);

	// DEV ONLY (by darrin)
	// if `program` is empty, fill it with example data for visualization.
	// Use when you need complete data in `program`
	// (so you don't have to enter it manually)
	//   if (!program.dateStart) {
	//   	program.injectTestData()
	//   }

	const handleAddSession = (day) => {
		history.push("/program", {
			initialView: VIEW.SESSION,
			initialFormMode: "add",
			initialFormValues: { sessionLength: [day, day] },
		});
	};

	const handleEditProgram = () => {
		setModalVisible(true);
	};

	const doReorder = (list, one) => {
		setSingle(one);
		setItemList(list);
		setDrawerVisible(true);
	};

	const programWidgets = (p) => {
		return (
			<Space size={10}>
				<Tooltip title="Edit Program">
					<SettingOutlined onClick={handleEditProgram} />
				</Tooltip>
				<Tooltip title="Export program to file">
					<DownloadOutlined onClick={() => exportProgramToFile(program.id)} />
				</Tooltip>
				<Tooltip title="Copy program to clipboard">
					<CopyOutlined onClick={() => copyProgramToClipboard(program.id)} />
				</Tooltip>
			</Space>
		);
	};

	const programHeader = (p) => {
		const programDateString = `${moment(p.dateStart).format("MMM DD")} - ${moment(p.dateEnd).format("MMM DD")}`;

		return (
			<span>
				{p.name} - ({programDateString})
			</span>
		);
	};

	return program.dateStart ? (
		<>
			<ProgramModal visible={modalVisible} setVisible={setModalVisible} />
			<ReorderDnD
				visible={drawerVisible}
				setVisible={setDrawerVisible}
				itemList={itemList}
				setItemList={setItemList}
				single={single}
			/>

			<Card title={programHeader(program)} extra={programWidgets()}>
				<Table
					className="program-agenda"
					showHeader={false}
					size="small"
					dataSource={formatDataSource(program.days)}
					pagination={false}>
					<Column
						title="Date"
						dataIndex="date"
						render={(date, day, i) => (
							<ConfigProvider renderEmpty={() => renderNoData({
								type: "Session",
								handleAddSession,
								date,
							})}>
								<div className="agendaItems">
									<Space size={8}>
										<p>Program Day: {moment(date).format("ddd, MMM Do Y")}</p>
										<Tooltip title="Add Session">
											<PlusOutlined onClick={() => handleAddSession(date)} />
										</Tooltip>
										{
											day.sessions.length > 1
												? <Tooltip title="Reorder Sessions">
													<UnorderedListOutlined onClick={() => doReorder(day.sessions, day)} />
												</Tooltip>
												: null
										}
									</Space >
									{
										day.sessions.length > 0
											? <Sessions sessions={day.sessions} doReorder={doReorder} type="Presentation" />
											: <Sessions sessions={day.sessions} doReorder={doReorder} type="Session" />
									}
									{i + 1 >= program.days.length ? null : <Divider />}
								</div >
							</ConfigProvider >)}
					/>
				</Table>
			</Card>
		</>
	) : (
			<Skeleton />
		);
}

export default Agenda;
