import React from "react";

import { useHistory } from "react-router-dom";

import { Button } from "antd";

import GenericModal from "../GenericModal/GenericModal";

import { VIEW } from "../../forms/FormManager";

function FlowSwitchTwoModal(props) {
  const { isVisible, setVisibility, setFormView, setFormMode } = props;

  const history = useHistory();

  const handleAddPresentation = () => {
    setFormMode("add")
    setFormView(VIEW.PRESENTATION);

    setVisibility(false);
  };

  const handleReviewProgram = () => {
    history.push("/review");

    setVisibility(false);
  };


  return (
    <GenericModal
      isVisible={isVisible}
      data={{
        // NOT REQUIRED BUT HERE FOR DOCUMENTATION PURPOSES
        // closable: true,
        // onCancel: function () {
        //   setVisibility(false);
        // },

        title: "What would you like to do next?",
        content: [
          <>
            <h3>Option A</h3>
            <p>Save current presentation and add another.</p>
            <Button type="primary" onClick={handleAddPresentation}>
              Add Presentation
            </Button>
          </>,
          <>
            <h3>Option B</h3>
            <p>Save and view entire program / agenda.</p>
            <Button type="primary" onClick={handleReviewProgram}>
              Review Program
            </Button>
          </>,
        ],
        footer: {},
      }}
    />
  );
}

export default FlowSwitchTwoModal;
