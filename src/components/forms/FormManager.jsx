import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import ProgramForm from "./ProgramForm";
import SessionForm from "./SessionForm";
import PresentationForm from "./PresentationForm";
import Agenda from "../program/Agenda";

const VIEW = {
	PROGRAM: 0,
	SESSION: 1,
	PRESENTATION: 2,
	REVIEW: 3,
};

function FormManager(props) {
	const location = useLocation()
	console.log(`FormManager.jsx 17: `, location.state)
	const initialView = location.state.initialView;
	const [formView, setFormView] = useState(initialView ? initialView : VIEW.PROGRAM);

	const getFormComponentForView = () => {
		switch (formView) {
			case VIEW.PROGRAM:
				return <ProgramForm setFormView={setFormView} />;
			case VIEW.SESSION:
				return <SessionForm setFormView={setFormView} />;
			case VIEW.PRESENTATION:
				return <PresentationForm setFormView={setFormView} />;
			case VIEW.REVIEW:
				return <Agenda setFormView={setFormView} />;
			default:
				return <ProgramForm setFormView={setFormView} />;
		}
	};

	return <div className="form-container">{getFormComponentForView()}</div>;
}

export default FormManager;

export { VIEW };
