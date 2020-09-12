//Packages
import React, {useState} from "react";

// antd setup
import { Button, } from "antd";
import { PlusOutlined, } from '@ant-design/icons';

//Components

function renderNoData(data) {
	const { type, date, sessionId, handleAddSession, handleAddPresentation, doCreateProgram } = data

	const onClick = (e) => {
		switch (true) {
			case (type === "Program" && typeof doCreateProgram === "function"):
				console.log(`NoData.js 27: `, )
				doCreateProgram()
				break;
		
			case (type === "Session" && typeof handleAddSession === "function"):
				handleAddSession(date)
				break;
		
			case (type === "Presentation" && typeof handleAddPresentation === "function"):
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
			<p>Add New {type}</p>
		</div>
	)
}

export default renderNoData;
