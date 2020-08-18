import DownYamlButton from "./downYamlButton";

import React, { useState } from "react";
import Fade from "react-reveal/Fade";

import { Button } from "antd";

import FlowSwitchOneModal from "../Modals/FlowSwitchOne/FlowSwitchOneModal";
import FlowSwitchTwoModal from "../Modals/FlowSwitchTwo/FlowSwitchTwoModal";

const LandingPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  return (
    <Fade bottom>
      {/* <div>
       

        <Button type="primary" onClick={() => setModalVisible(true)}>
          Click to open first modal
        </Button>

        <br />
        <br />

        <Button type="primary" onClick={() => setModalVisible1(true)}>
          Click to open second modal
        </Button>
      </div> */}

      <div>
        <DownYamlButton />
      </div>
      {/* <FlowSwitchOneModal
        isVisible={modalVisible}
        setVisibility={setModalVisible}
      />
      <FlowSwitchTwoModal
        isVisible={modalVisible1}
        setVisibility={setModalVisible1}
      /> */}
    </Fade>
  );
};

export default LandingPage;
