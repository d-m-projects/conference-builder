import React, { useState } from "react";
import { useLocation } from "react-router-dom";

// Components
import FormManager, { VIEW } from "../forms/FormManager";
import Agenda from "./Agenda"

function ProgramPage(props) {
	const location = useLocation()
	const initialView = location.state.initialView;
	const [formView, setFormView] = useState(initialView ? initialView : VIEW.PROGRAM);

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
