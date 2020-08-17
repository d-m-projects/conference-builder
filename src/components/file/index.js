import React, { useContext, useState, useEffect } from "react";
import { ProgramContext } from "../../contexts/Program";

// antd components
import { Row, Col, Button, Steps, message, Card, Space } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import db from "../../data/database"
import data from "./data" // test data for scaffold

const { Meta } = Card

const File = () => {
	const [fileman, setFileman] = useState([])
	const program = useContext(ProgramContext);
	console.log(`index.js 16: `, fileman)
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
				{data.map(item =>
					<Col span={8} key={item.id}>
						<Card

							actions={[
								<EditOutlined key="edit" />,
							]}
							title={item.name}
						>
							<p>Begin: {item.dateStart}</p>
							<p>End: {item.dateEnd}</p>
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