import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// Components
import FormManager, { VIEW } from "../forms/FormManager";
import Agenda from "./Agenda"

// antd setup
import { Space, message, Col, Row } from "antd";


function ProgramPage(props) {
	const location = useLocation()
	let initialView
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM
	const [formView, setFormView] = useState(initialView);

	return (
		<Row gutter={28}>
			<Col span={12}>
				<FormManager initialView={formView} />
			</Col>
			<Col span={12}>
				<Agenda initialView={formView} />
			</Col>
		</Row>
	);
}

export default ProgramPage;
