//Packages
import React, {useState} from "react";

// antd setup
import { Button, } from "antd";
import { PlusOutlined, } from '@ant-design/icons';

//Components

function renderNoData(data) {
	const { type, date, sessionId, handleAddSession, handleAddPresentation, doCreateProgram } = data

	console.log(`NoData.js 13: doCreateProgram`, typeof doCreateProgram === "function")
	console.log(`NoData.js 13: handleAddSession`, typeof handleAddSession === "function")
	console.log(`NoData.js 13: handleAddPresentation`, typeof handleAddPresentation === "function")

	const onClick = (e) => {
		console.log(`NoData.js 17: `, doCreateProgram)
		switch (true) {
			case (type === "program" && typeof doCreateProgram === "function"):
				console.log(`NoData.js 27: `, )
				doCreateProgram()
				break;
		
			case (type === "session" && handleAddSession):
				handleAddSession(date)
				break;
		
			case (type === "presentation" && handleAddPresentation):
				handleAddPresentation(sessionId)
				break;
		
			default:
				console.log(`NoData.js 31: nothin`, )
				break;
		}

	}

	return (
		<div className="noData">
			<Button type="primary" shape="round" icon={<PlusOutlined />} size="large" onClick={onClick}/>
			<p>Add New {type.charAt(0).toUpperCase() + type.slice(1)}</p>
		</div>
	)
}

export default renderNoData;
