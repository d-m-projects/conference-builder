import React from "react";

import { Modal } from "antd";

import "./styles.scss";

function GenericModal(props) {
  const { isVisible, data } = props;

  return (
    <Modal
      closable={data.closable === undefined ? false : data.closable}
      onCancel={data.onCancel === undefined ? null : data.onCancel}
      visible={isVisible}
      title={data.title}
      footer={<div className="generic-modal-footer">{data.footer}</div>}>
      <div className="generic-modal-content">
        <div className="generic-modal-option-a">{data.content[0]}</div>
        <div className="generic-modal-option-b">{data.content[1]}</div>
      </div>
    </Modal>
  );
}

export default GenericModal;
