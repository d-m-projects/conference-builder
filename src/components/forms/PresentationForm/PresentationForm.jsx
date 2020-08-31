import React, { useState } from "react";

import FlowSwitchTwoModal from "../../Modals/FlowSwitchTwo/FlowSwitchTwoModal";
import Form from "./Form";

import "./styles.scss";

function PresentationForm(props) {
  const { setFormView } = props;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="presentation-container">
      {/* UI Flow Modal for jumping to review program or add additional presentation */}
      <FlowSwitchTwoModal isVisible={modalVisible} setVisibility={setModalVisible} setFormView={setFormView} />

      <Form setModalVisible={setModalVisible} />
    </div>
  );
}

export default PresentationForm;
