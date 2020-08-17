import React, { useState, useContext } from "react";
import YAML from "yaml";

import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { ProgramContext } from "../../contexts/Program";

const DownYamlButton = () => {
  //Brings in global state.
  const program = useContext(ProgramContext);
  //Pulls out the data from global state to build a JSON object that can be converted to YAML.
  const preYamlProgram = {
    name: program.name,
    dateStart: program.dateStart,
    dateEnd: program.dateEnd,
    program: program.days,
    sessions: program.sessions,
  };
  //Local state that holds YAML
  const [yamlData, setYamlData] = useState(YAML.stringify(preYamlProgram));
  //Logs data in the console.
  function JsYamlContert() {
    console.log("context object------->", program);
    console.log("Json converted to yaml-----> ", yamlData);
  }

  return (
    <div>
      <Button
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size={"large"}
        onClick={JsYamlContert}
      >
        Download
      </Button>
    </div>
  );
};

export default DownYamlButton;





