import React from "react";

import { Row, Col, Button, Steps, message, Card, Space } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import data from "./data"

const { Meta } = Card

const File = () => {
	//   const screens = useBreakpoint(); // for setting up responsiveness

	return (
		<>
			<Row gutter={[10, 10]}>
				{data.map(item =>
					<Col span={8}>
						<Card
							key={item.id}
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