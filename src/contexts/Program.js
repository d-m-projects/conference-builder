import React, { useState, useEffect } from "react";

import db from "../data/database";

const ProgramContext = React.createContext();

const defaultProgram = {
  name: "",
  dateStart: null,
  dateEnd: null,
  days: [],
  sessions: [],
  nextSessionId: 0,
};
const ProgramProvider = (props) => {
  const [program, setProgram] = useState(defaultProgram);

  useEffect(() => {
    conlog("Context Changed", program);
    // if (program.dateStart) {
    // 	db.update(program)
    // 		.then((x) => {
    // 			console.log("Context > DB ", x, program.current)
    // 		})
    // 		.catch((err) => {
    // 			console.error("Context > DB update failed", err)
    // 		})
    // }
  }, [program]);

  const createProgram = (newProgram) => {
    setProgram({
      ...program,
      name: newProgram.name,
      dateStart: newProgram.dateStart,
      dateEnd: newProgram.dateEnd,
      days: newProgram.days,
    });
  };

  const createSession = (newSession) => {
    setProgram({
      ...program,
      sessions: [...program.sessions, { ...newSession, id: program.nextSessionId }],
      nextSessionId: program.nextSessionId + 1,
    });
  };

  const deleteSession = (sessionId) => {
    setProgram({
      ...program,
      sessions: program.sessions.filter((session) => {
        if (sessionId !== session.id) {
          return true;
        }
      }),
    });
  };

  const loadProgress = (programInfo) => {
    setProgram(programInfo);
  };

  const editSession = (modifiedSession) => {
    setProgram({
      ...program,
      sessions: program.sessions.map((session) => {
        if (session.id === modifiedSession.id) {
          return modifiedSession;
        }
        return session;
      }),
    });
  };

  const clearProgram = () => {
    db.clean();
    setProgram(defaultProgram);
  };

  const tooManyTabs = () => {};

  return (
    <ProgramContext.Provider
      value={{ ...program, createProgram, createSession, editSession, deleteSession, loadProgress, clearProgram }}>
      {props.children}
    </ProgramContext.Provider>
  );
};

export { ProgramProvider, ProgramContext };

function conlog() {
  const show = true;
  if (show) {
    console.log("__Program_");
    for (const arg in arguments) {
      console.dir(arguments[arg]);
    }
    console.log("^^^^^^^^^^");
  }
}
