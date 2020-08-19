import React from "react";

import FormManager, { VIEW } from "../forms/FormManager";

function ProgramPage() {
  return (
    <div>
      <FormManager initialView={VIEW.PROGRAM} />
    </div>
  );
}

export default ProgramPage;
