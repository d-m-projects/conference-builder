import React, { useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import "./styles.scss";

const localizer = momentLocalizer(moment);

function ProgramEvent({ event }) {
  const program = useContext(ProgramContext);
  const { deleteSession } = program;

  function handleDelete(event) {
    deleteSession(event);

    message.success("Session deleted!");
  }

  function handleEdit(event) {
    console.log("Edit requested on", event);
  }

  return (
    <>
      <span className="program-session-icons">
        <Popconfirm
          title="Are you sure you want to delete this session?"
          onConfirm={() => handleDelete(event)}
          okText="Yes"
          cancelText="No">
          <DeleteOutlined />
        </Popconfirm>
        <EditOutlined onClick={() => handleEdit(event)} />
      </span>
      <span>{event.title}</span>
    </>
  );
}

function ManageProgram() {
  const program = useContext(ProgramContext);
  const { name, sessions, addSession, dateStart, dateEnd } = program;

  function handleSelectSlot(timeSlot) {
    const { start, end } = timeSlot;
    if (
      moment(start).dayOfYear() >= moment(dateStart).dayOfYear() &&
      moment(end).dayOfYear() <= moment(dateEnd).dayOfYear()
    ) {
      const title = window.prompt("Enter a name for this session.");

      if (title) {
        const session = {
          title,
          start: new Date(start),
          end: new Date(end),
          id: sessions.length,
        };

        addSession(session);

        message.success("New session added.");
      }
    } else {
      message.warn("Date not within range of program.");
    }
  }

  function dayPropGetter(date) {
    if (
      moment(date).dayOfYear() < moment(dateStart).dayOfYear() ||
      moment(date).dayOfYear() > moment(dateEnd).dayOfYear()
    ) {
      return {
        className: "calendar-days-default",
      };
    } else {
      return {
        className: "program-days",
      };
    }
  }

  function eventPropGetter(event) {
    return {
      className: "program-session-card",
    };
  }

  return (
    <div className="manage-program">
      <h1>{name}</h1>
      <Calendar
        selectable
        popup
        events={sessions}
        localizer={localizer}
        style={{ height: 800 }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        components={{
          event: ProgramEvent,
        }}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}

export default ManageProgram;
