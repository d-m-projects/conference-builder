import React from "react";

import { useHistory } from "react-router-dom";

import { Button } from "antd";

import GenericModal from "../GenericModal/GenericModal";

import { VIEW } from "../../forms/FormManager";

function FlowSwitchOneModal(props) {
  const { isVisible, setVisibility, setFormView, setFormMode } = props;

  const history = useHistory();

  const handleCreateSession = () => {
    setFormMode("add")
    setFormView(VIEW.SESSION);

    setVisibility(false);
  };

  const handleAddPresentation = () => {
    setFormView(VIEW.PRESENTATION);

    setVisibility(false);
  };

  const handleReview = () => {
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
            <p>Save current session and create another for this program.</p>
            <Button type="primary" onClick={handleCreateSession}>
              Create Session
            </Button>
          </>,
          <>
            <h3>Option B</h3>
            <p>Save current session and add one or more presentations to it.</p>
            <Button type="primary" onClick={handleAddPresentation}>
              Add Presentation
            </Button>
          </>,
        ],
        footer: (
          <Button type="primary" onClick={handleReview}>
            Review program
          </Button>
        ),
      }}
    />
  );
}

export default FlowSwitchOneModal;
