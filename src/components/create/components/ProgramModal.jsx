import React, { useState, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { Modal } from "antd";

function ProgramModal({ session, visible, setVisible }) {
  function handleSubmit() {
    setVisible(false);
  }

  function handleCancel() {
    setVisible(false);
  }

  return (
    <Modal
      visible={visible}
      title={session.title}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={"Submit"}
      cancelText={"Back"}>
      <p>
        Modal stuff Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, quaerat ab temporibus
        similique culpa quis, nobis vitae sint aliquam placeat ipsum? Consequatur quibusdam ipsa explicabo deserunt
        impedit quis, voluptatum corporis.
      </p>
      <ul>
        <li>Name: {`${session.title}`}</li>
        <li>Start: {`${session.start}`}</li>
        <li>End: {`${session.end}`}</li>
      </ul>
    </Modal>
  );
}

export default ProgramModal;
