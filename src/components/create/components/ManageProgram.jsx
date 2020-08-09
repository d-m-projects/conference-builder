import React, { useState, useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import "./styles.scss";

const localizer = momentLocalizer(moment);

function ProgramEvent({ event }) {
  // const program = useContext(ProgramContext);

  function deleteSession(event) {
    console.log("Delete requested on", event);
  }

  function editSession(event) {
    console.log("Edit requested on", event);
  }

  return (
    <>
      <span className="program-session-icons">
        <DeleteOutlined className="test" onClick={() => deleteSession(event)} />{" "}
        <EditOutlined onClick={() => editSession(event)} />
      </span>
      <span>{event.title}</span>
    </>
  );
}

function ManageProgram() {
  const program = useContext(ProgramContext);

  const [sessions, setSessions] = useState([]);

  function addSession(timeSlot) {
    const { start, end } = timeSlot;
    const title = window.prompt("Enter a name for this session");

    if (title) {
      program.days.map((day) => {
        if (moment(day.date).isSame(moment(end), "day")) {
          const newSession = {
            title,
            start: new Date(start),
            end: new Date(end),
          };

          day.sessions.push(newSession);

          setSessions([...sessions, { ...newSession }]);
        }
        return day;
      });
    }
  }

  function dayPropGetter(date) {
    if (
      moment(date).dayOfYear() < moment(program.dateStart).dayOfYear() ||
      moment(date).dayOfYear() > moment(program.dateEnd).dayOfYear()
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
      <h1>{program.name}</h1>
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
        onSelectSlot={addSession}
      />
    </div>
  );
}

export default ManageProgram;
