//Packages
import React, {useState} from "react";

// antd setup
import { Button, } from "antd";
import { PlusOutlined, } from '@ant-design/icons';

//Components

function renderNoData(data) {
	const { type, date, handleAddSession, handleAddPresentation, sessionId } = data

	if (type === "presentation") console.log(`type: `, type)
	// if (type === "session") console.log(`func: `, doClick)

	const onClick = (e) => {
		if (type === "session" && handleAddSession) {
			handleAddSession(date)
		} else if (type === "presentation" && handleAddPresentation){
			handleAddPresentation(sessionId)
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
