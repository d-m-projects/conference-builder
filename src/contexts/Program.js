import React, { useState, useEffect } from "react";

import moment from "moment";

import db from "../data/database";

const ProgramContext = React.createContext();

const defaultProgram = {
  name: "",
  dateStart: null,
  dateEnd: null,
  days: [],
  sessions: [],
  nextSessionId: 0,
  globalPresenters: [],
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
      days: program.days.map((day) => {
        if (moment(day.date).dayOfYear() === moment(newSession.dateStart).dayOfYear()) {
          return { ...day, sessions: [...day.sessions, { ...newSession, id: program.nextSessionId }] };
        }
        return day;
      }),
      nextSessionId: program.nextSessionId + 1,
    });
  };

  const editSession = (modifiedSession) => {
    // setProgram({
    //   ...program,
    //   sessions: program.sessions.map((session) => {
    //     if (session.id === modifiedSession.id) {
    //       return modifiedSession;
    //     }
    //     return session;
    //   }),
    // });
  };

  const deleteSession = (sessionId) => {
    // setProgram({
    //   ...program,
    //   sessions: program.sessions.filter((session) => {
    //     if (sessionId !== session.id) {
    //       return true;
    //     }
    //   }),
    // });
  };

  const createPresentation = (sessionId, newPresentation) => {
    setProgram({
      ...program,
      sessions: program.sessions.map((session) => {
        if (session.id === sessionId) {
          session.presentations.push(newPresentation);
        }

        return session;
      }),
    });
  };

  const addGlobalPresenter = (presenter) => {
    setProgram({
      ...program,
      globalPresenters: [...program.globalPresenters, presenter],
    });
  };

  const deleteGlobalPresenter = (presenter, force = false) => {
    /*
      Can only remove a global presenter if they aren't listed
      anywhere else in the program
    */

    // Deletion helper func
    const remove = () => {
      setProgram({
        ...program,
        globalPresenters: program.globalPresenters.filter((p) => {
          if (p !== presenter) {
            return true;
          }
        }),
      });
    };

    // Checking
    if (force) {
      remove();
    } else {
      let inUse = false;

      // Go thru all presentations and see if presenter is used elsewhere
      program.days.forEach((day) => {
        day.sessions.forEach((session) => {
          session.presentations.forEach((presentation) => {
            if (presentation.presenters.includes(presenter)) {
              inUse = true;
            }
          });
        });
      });

      if (!inUse) {
        remove();
      }
    }
  };

  const loadProgress = (programInfo) => {
    setProgram(programInfo);
  };

  const clearProgram = () => {
    db.clean();
    setProgram(defaultProgram);
  };

  const tooManyTabs = () => {};

  return (
    <ProgramContext.Provider
      value={{
        ...program,
        createProgram,
        createSession,
        editSession,
        deleteSession,
        createPresentation,
        addGlobalPresenter,
        deleteGlobalPresenter,
        loadProgress,
        clearProgram,
      }}>
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
