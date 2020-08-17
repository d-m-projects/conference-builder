import React from "react";

import { useHistory } from "react-router-dom";

import { Button } from "antd";

import GenericModal from "../GenericModal/GenericModal";

function FlowSwitchTwoModal(props) {
  const { isVisible, setVisibility } = props;

  const history = useHistory();

  const handleReviewProgram = () => {
    console.log("User selected 'review program'");
    history.push("/");

    setVisibility(false);
  };

  const handleAddPresentation = () => {
    console.log("User selected 'add presentation'");
    history.push("/");

    setVisibility(false);
  };

  const handleHome = () => {
    console.log("User selected 'home'");
    history.push("/");

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

        title: "What would you like to do?",
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
        footer: (
          <Button type="primary" onClick={handleHome}>
            Save for now and go to home
          </Button>
        ),
      }}
    />
  );
}

export default FlowSwitchTwoModal;
