import React, { useContext } from "react";
import ProgramContext from "../../../contexts/programContext";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const ManageProgram = () => {
  const program = useContext(ProgramContext);
  console.log("PROGRAM CONTEXT", program);

  return (
    <>
      {/* <Calendar
        selectable
        localizer={localizer}
        // events={this.state.events}
        defaultView={Views.WEEK}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date(2015, 3, 12)}
        // onSelectEvent={(event) => alert(event.title)}
        // onSelectSlot={this.handleSelect}
      /> */}
    </>
  );
};

export default ManageProgram;
