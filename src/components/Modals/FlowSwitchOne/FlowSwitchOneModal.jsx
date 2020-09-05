import React from "react";

import { useHistory } from "react-router-dom";

import { Button } from "antd";

import GenericModal from "../GenericModal/GenericModal";

import { VIEW } from "../../forms/FormManager";

function FlowSwitchOneModal(props) {
  const { isVisible, setVisibility, sessionLength } = props;

  const history = useHistory();

  const handleCreateSession = () => {
    history.push("/program", {
      initialView: VIEW.SESSION,
      initialFormValues: { sessionLength: [sessionLength[0]._d, sessionLength[1]._d] },
    });

    setVisibility(false);
  };

  const handleAddPresentation = () => {
    history.push("/program", {
      initialView: VIEW.PRESENTATION,
      initialFormValues: { presentationLength: [sessionLength[0]._d, sessionLength[1]._d] },
    });

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
        // Show 'x' close option
        // closable: true,
        // Run on modal close
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
