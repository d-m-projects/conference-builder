import React, { useContext } from "react";
import { ProgramContext } from "../../contexts/Program";
import { useHistory } from "react-router-dom";

import { VIEW } from "../forms/FormManager";

// antd components
import { Space, Popconfirm, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function EditDeleteWidget({ event, type }) {
  const program = useContext(ProgramContext);

  const {
    selectedSessionId,
    getNextPresenterId,
    setNextPresenterId,
    selectSessionByPresentationId,
    deleteSession,
    deletePresentation,
  } = program;

  const history = useHistory();

  const handleDelete = (event, type) => {
    if (type === "session") {
      if (selectedSessionId === event.id) {
        message.error("Cannot delete a session with modifications in progress!");
      } else {
        deleteSession(event.id);
        message.success(`"${event.name}" deleted!`);
      }
    } else {
      // Presentation
      deletePresentation(event.id);
      message.success(`"${event.name}" deleted!`);
    }
  };

  const handleEdit = (event, type) => {
    // When the user clicks edit on something else and the form is the same,
    // just throw a notification that yes we are editing what you last clicked.
    message.info(`Now editing "${event.name}"`);

    if (type === "session") {
      const initialFormValues = {
        sessionId: event.id,
        sessionName: event.name,
        sessionLength: [event.dateStart, event.dateEnd],
      };

      history.push("/program", {
        initialView: VIEW.SESSION,
        initialFormMode: "edit",
        initialFormValues,
      });
    } else {
      selectSessionByPresentationId(event.id);

      const presenters = [];
      let pId = getNextPresenterId();

      event.presenters.forEach((presenter) => {
        presenters.push({ name: presenter, id: String(pId) });
        pId++;
      });

      // Manually update presenter id
      setNextPresenterId(pId + 1);

      const creditsList = [];
      for (const key in event.credits) {
        creditsList.push(`${key} | ${event.credits[key]}`);
      }

      const initialFormValues = {
        presentationName: event.name,
        presentationLength: [event.dateStart, event.dateEnd],
        presenters: presenters,
        credits: event.credits,
        creditsList: creditsList,
      };

      history.push("/program", {
        initialView: VIEW.PRESENTATION,
        initialFormMode: "edit",
        initialFormValues,
        presentationId: event.id,
      });
    }
  };

  return (
    <Space size={8}>
      <Tooltip title={type === "session" ? `Edit Session` : `Edit Presentation`}>
        <EditOutlined onClick={() => handleEdit(event, type)} />
      </Tooltip>
      <Popconfirm
        title={`Are you sure you want to delete this ${type === "session" ? "session" : "presentation"}?`}
        onConfirm={() => handleDelete(event, type)}
        okText="Yes"
        cancelText="No">
        <Tooltip title={type === "session" ? `Delete Session` : `Delete Presentation`}>
          <DeleteOutlined />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
}

export default EditDeleteWidget;
