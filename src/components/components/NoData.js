//Packages
import React, {useState} from "react";

// antd setup
import { Button, } from "antd";
import { PlusOutlined, } from '@ant-design/icons';

//Components

function renderNoData(data) {
	console.log(`Empty.js 11: `, data.type)

	// const handleAddSession = (day) => {
	// 	history.push("/program", {
	// 		initialView: VIEW.SESSION,
	// 		initialFormMode: "add",
	// 		initialFormValues: { sessionLength: [day, day] },
	// 	});
	// };

	const onClick = (e) => {
		console.log(`NoData.js 22: `, data)
	}

	return (
		<div className="noData">
			<Button type="primary" shape="round" icon={<PlusOutlined />} size="large" onClick={onClick}/>
			<p>Add New {data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
		</div>
	)
}

export default renderNoData;
