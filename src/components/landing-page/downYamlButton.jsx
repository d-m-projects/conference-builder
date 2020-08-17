import React, { useState, useContext } from "react";
import YAML from "yaml";


import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { ProgramContext } from "../../contexts/Program";

const DownYamlButton = () => {
  const program = useContext(ProgramContext);
  const [jsonData, setJasonData] = useState(program);

  function JsYamlContert() {
    console.log("db object------->", program);
    console.log("Json converted to yaml-----> ", );
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
