//Packages
import React, {useState} from "react";

// antd setup
import { Button, } from "antd";
import { PlusOutlined, } from '@ant-design/icons';

//Components

function renderNoData(data) {
	const { type, date, doClick } = data
	// console.log(`Empty.js 11: `, data)

	const onClick = (e) => {
		doClick(date)
	}

	return (
		<div className="noData">
			<Button type="primary" shape="round" icon={<PlusOutlined />} size="large" onClick={onClick}/>
			<p>Add New {type.charAt(0).toUpperCase() + type.slice(1)}</p>
		</div>
	)
}

export default renderNoData;
