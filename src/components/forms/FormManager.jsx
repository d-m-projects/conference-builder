import React, { useState } from "react";

import ProgramForm from "./ProgramForm";
import SessionForm from "./SessionForm";
import PresentationForm from "./PresentationForm";

const VIEW = {
  PROGRAM: 0,
  SESSION: 1,
  PRESENTATION: 2,
  REVIEW: 3,
};

function FormManager() {
  const [formView, setFormView] = useState(VIEW.PROGRAM);

  const getFormComponentForView = () => {
    switch (formView) {
      case VIEW.PROGRAM:
        return <ProgramForm setFormView={setFormView} />;
      case VIEW.SESSION:
        return <SessionForm setFormView={setFormView} />;
      case VIEW.PRESENTATION:
        return <PresentationForm setFormView={setFormView} />;
      default:
        return <ProgramForm setFormView={setFormView} />;
    }
  };

  return <div className="form-container">{getFormComponentForView()}</div>;
}

export default FormManager;

export { VIEW };
