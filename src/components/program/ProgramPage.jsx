import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// Components
import FormManager, { VIEW } from "../forms/FormManager";
import Agenda from "./Agenda"

// antd setup
import { Modal, Button, message, Col, Layout, Row } from "antd";


function ProgramPage(props) {
	const location = useLocation()
	let initialView
	location.state ? initialView = location.state.initialView : initialView = VIEW.PROGRAM
	const [formView, setFormView] = useState(initialView);

	return (
		<>
			<div>
				<FormManager initialView={formView} />
			</div>
			<div>
				<Agenda initialView={formView} />
			</div>
		</>
	);
}

export default ProgramPage;
