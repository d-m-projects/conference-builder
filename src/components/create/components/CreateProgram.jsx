import React, { useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

// antd setup
import "antd/dist/antd.css";

const CreateProgram = () => {
  const program = useContext(ProgramContext);

  console.log("PROGRAM CONTEXT:\n", program);

  return <div>Creation instructions</div>;
};

export default CreateProgram;
