//Packages
import React from "react";

// antd setup
import { Button, } from "antd";
import { PlusOutlined, } from '@ant-design/icons';


//Components

function renderNoData(data) {
	console.log(`Empty.js 11: `, data)
	return (
		<>
			<Button type="primary" shape="round" icon={<PlusOutlined />} size="large" />
			<h2>Add New {data.type.charAt(0).toUpperCase() + data.type.slice(1)}</h2>
		</>
	)
}

export default renderNoData;
