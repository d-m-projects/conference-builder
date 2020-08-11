// React
import React, { useState, useContext } from "react";
import { ProgramContext } from "../../../contexts/Program";

// Calendar
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

// UI Components
import { Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Components
import SessionModal, { ModalMode } from "./SessionModal";

// Styles
import "./styles.scss";

const localizer = momentLocalizer(moment);

function ProgramEvent({ event }) {
  const program = useContext(ProgramContext);
  const { editSession, deleteSession } = program;

  const [showModal, setShowModal] = useState(false);

  function handleDelete(event) {
    deleteSession(event);

    message.success("Session deleted!");
  }

  function handleEdit(event) {
    setShowModal(true);
  }

  return (
    <>
      <SessionModal
        mode={ModalMode.EDIT}
        visible={showModal}
        setVisible={setShowModal}
        editSession={editSession}
        session={event}
      />
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
  const { name, sessions, addSession, modifyTempSession, dateStart, dateEnd } = program;

  const [showModal, setShowModal] = useState(false);

  function handleSelectSlot(timeSlot) {
    const { start, end } = timeSlot;

    // Verify date selection is within program range
    if (
      moment(start).dayOfYear() >= moment(dateStart).dayOfYear() &&
      moment(end).dayOfYear() <= moment(dateEnd).dayOfYear()
    ) {
      // Push dates to temp session and open modal
      modifyTempSession({ start, end });

      setShowModal(true);
    } else {
      message.warn("Date not within range of program.");
    }
  }

  // Change calendar day card backgrounds based on program date range
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
      {/* ADD SESSION MODAL */}
      <SessionModal mode={ModalMode.ADD} visible={showModal} setVisible={setShowModal} addSession={addSession} />

      {/* PROGRAM TITLE HEADER */}
      <h1>{name}</h1>

      {/* BIG CALENDAR BOI */}
      <Calendar
        selectable
        popup
        events={sessions}
        localizer={localizer}
        style={{ height: 800 }}
        defaultDate={dateStart}
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
