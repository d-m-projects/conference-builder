import React, { useState } from "react";

import FlowSwitchTwoModal from "../../Modals/FlowSwitchTwo/FlowSwitchTwoModal";
import Form from "./Form";

import "./styles.scss";

function PresentationForm(props) {
  const { initialFormMode, initialFormValues, setFormView } = props;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="presentation-container">
      {/* UI Flow Modal for jumping to review program or add additional presentation */}
      <FlowSwitchTwoModal isVisible={modalVisible} setVisibility={setModalVisible} setFormView={setFormView} />

      <Form initialFormMode={initialFormMode} initialFormValues={initialFormValues} setModalVisible={setModalVisible} />
    </div>
  );
}

export default PresentationForm;
