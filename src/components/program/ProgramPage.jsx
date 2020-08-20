import React from "react";

import FormManager, { VIEW } from "../forms/FormManager";

function ProgramPage(props) {
  return (
    <div>
      <FormManager initialView={VIEW.PROGRAM} />
    </div>
  );
}

export default ProgramPage;
