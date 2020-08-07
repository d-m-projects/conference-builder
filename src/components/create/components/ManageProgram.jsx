import React, { useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

import * as dates from "date-arithmetic";

import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import moment from "moment";

const localizer = momentLocalizer(moment);

function ProgramCalendarView(props) {
  const program = useContext(ProgramContext);

  const range = buildRange(program.DateStart, program.DateEnd);

  function buildRange(startDate, endDate) {
    const range = [];
    let current = startDate;

    while (dates.lte(current, endDate, "day")) {
      range.push(current);
      current = dates.add(current, 1, "day");
    }

    return range;
  }

  return <TimeGrid {...props} range={range} />;
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
  return (
    <>
      <Calendar
        events={[]}
        localizer={localizer}
        views={{ month: ProgramCalendarView }}
        style={{ height: 800 }}
        components={{
          toolbar: ProgramCalendarToolbar,
        }}
      />
    </>
  );
}

export default ManageProgram;
