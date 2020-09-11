import React, { useState, useEffect } from "react";

import SessionForm from "./SessionForm";
import PresentationForm from "./PresentationForm/PresentationForm";
import Agenda from "../program/Agenda";

const VIEW = {
  SESSION: 1,
  PRESENTATION: 2,
  REVIEW: 3,
};

function FormManager(props) {
  const { initialView, initialFormMode, initialFormValues } = props;
  const [formView, setFormView] = useState(initialView ? initialView : VIEW.SESSION);

  useEffect(() => {
    setFormView(initialView);
  }, [initialView]);

  const getFormComponentForView = () => {
    switch (formView) {
      case VIEW.SESSION:
        return (
          <SessionForm
            setFormView={setFormView}
            initialFormMode={initialFormMode}
            initialFormValues={initialFormValues}
          />
        );
      case VIEW.PRESENTATION:
        return (
          <PresentationForm
            setFormView={setFormView}
            initialFormMode={initialFormMode}
            initialFormValues={initialFormValues}
          />
        );
      case VIEW.REVIEW:
        return <Agenda setFormView={setFormView} />;
      default:
        return (
          <SessionForm
            setFormView={setFormView}
            initialFormMode={initialFormMode}
            initialFormValues={initialFormValues}
          />
        );
    }
  };

  return <div className="form-container">{getFormComponentForView()}</div>;
}

export default FormManager;

export { VIEW };
