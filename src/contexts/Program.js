import React, { useState, useEffect } from "react";

const ProgramContext = React.createContext();

const ProgramProvider = (props) => {
  const [program, setProgram] = useState({
    name: "",
    dateStart: null,
    dateEnd: null,
    days: [],
    sessions: [],
    nextSessionId: 0
  });

  useEffect(() => {
    console.log("Context Changed", program)
  }, [program])

  const createProgram = (programInfo) => {
    console.log("Setting Program...", programInfo);
    setProgram({
      ...program,
      name: programInfo.name,
      dateStart: programInfo.dateStart,
      dateEnd: programInfo.dateEnd,
      days: programInfo.days,
    });
  };

  const addSession = (session) => {
    setProgram({
      ...program,
      sessions: [...program.sessions, {...session, id: program.nextSessionId}],
      nextSessionId: program.nextSessionId + 1,
    });
  };

  const editSession = (session) => {
    // TODO Add functionality to edit existing session
  };

  const deleteSession = (session) => {
    setProgram({
      ...program,
      sessions: program.sessions.filter((event) => {
        if (event.id !== session.id) {
          return true;
        }
      }),
    });
  };

  return (
    <ProgramContext.Provider value={{ ...program, createProgram, addSession, editSession, deleteSession }}>
      {props.children}
    </ProgramContext.Provider>
  );
};

export { ProgramProvider, ProgramContext };
