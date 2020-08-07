import React, { useState, useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

import * as dates from "date-arithmetic";

import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import moment from "moment";

const localizer = momentLocalizer(moment);

function ProgramCalendarView(props) {
  const program = useContext(ProgramContext);

  const range = buildRange(program.dateStart, program.dateEnd);

  function buildRange(startDate, endDate) {
    const range = [];
    let current = startDate;

    while (dates.lte(current, endDate, "day")) {
      range.push(current);
      current = dates.add(current, 1, "day");
    }

    return range;
  }

  return <TimeGrid {...props} range={range} step={30} />;
}

ProgramCalendarView.title = () => {};

function ProgramCalendarToolbar() {
  const program = useContext(ProgramContext);

  return (
    <div className="program-calendar-toolbar">
      <h1>{program.Name}</h1>
    </div>
  );
}

function ManageProgram() {
  const program = useContext(ProgramContext);

  const [sessions, setSessions] = useState({ events: [] });

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

          setSessions({ events: [...sessions.events, { ...newSession }] });
        }
        return day;
      });
    }
  }

  return (
    <div className="yeet">
      <Calendar
        selectable
        events={sessions.events}
        localizer={localizer}
        views={{ month: ProgramCalendarView }}
        style={{ height: 800 }}
        components={{
          toolbar: ProgramCalendarToolbar,
        }}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={addSession}
      />
    </div>
  );
}

export default ManageProgram;
