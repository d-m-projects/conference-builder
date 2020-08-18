import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";


// antd components
import { Row, Col, Button, Steps, message, Card, Space } from "antd";
import { EditOutlined, DownloadOutlined } from '@ant-design/icons';

import moment from "moment";
import db from "../../data/database"
import data from "./data" // test data for scaffold

const { Meta } = Card

const File = () => {
	const [fileman, setFileman] = useState([])
	const program = useContext(ProgramContext);
	const { loadProgram } = program
	const history = useHistory()

	const doEditClick = async (id) => {
		await loadProgram(id)
		history.push("/create");
	}

	const doDownloadClick = async (id) => {
		console.log(`index.js 28: download click id `, id)
	}

	useEffect(() => {
		const getall = async () => {
			setFileman(await db.readAll())
		}
		getall()
	}, [])

	return (
		// to flex column count responsively
		// https://usehooks.com/useMedia/
		<>
			<Row gutter={[10, 10]}>
				{fileman.map((item, i) =>
					<Col span={8} key={item.id}>
						<Card key={item.id}
							actions={[
								<EditOutlined onClick={() => doEditClick(item.id)} />,
								<DownloadOutlined onClick={() => doDownloadClick(item.id)}  />,
							]}
							title={item.name}
						>
							<p>Begin: {moment(item.dateStart).format("ddd, MMM Do Y")}</p>
							<p>End: {moment(item.dateEnd).format("ddd, MMM Do Y")}</p>
						</Card>
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