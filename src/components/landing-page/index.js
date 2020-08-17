import React, { useState } from "react";
import Fade from "react-reveal/Fade";

import { Button } from "antd";

import FlowSwitchOneModal from "../Modals/FlowSwitchOne/FlowSwitchOneModal";

const LandingPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Fade bottom>
      <div>
        <p>
          This is the LandingPage!{" "}
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Click to open example modal
          </Button>
        </p>
      </div>

      <FlowSwitchOneModal isVisible={modalVisible} setVisibility={setModalVisible} />
    </Fade>
  );
};

export default LandingPage;
