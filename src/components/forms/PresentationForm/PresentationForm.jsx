import React from "react";

import Form from "./Form";

import "./styles.scss";

function PresentationForm(props) {
  const { initialFormMode, initialFormValues } = props;

  return (
    <div className="presentation-container">
      <Form initialFormMode={initialFormMode} initialFormValues={initialFormValues} />
    </div>
  );
}

export default PresentationForm;
