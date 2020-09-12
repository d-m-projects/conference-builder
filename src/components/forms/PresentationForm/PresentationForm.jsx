import React from "react";

import Form from "./Form";

function PresentationForm(props) {
  const { initialFormMode, initialFormValues } = props;

  return <Form initialFormMode={initialFormMode} initialFormValues={initialFormValues} />;
}

export default PresentationForm;
