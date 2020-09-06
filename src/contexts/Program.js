import React, { useState, useEffect } from "react";

import moment from "moment";

import db from "../data/database";

// Dev test data
import injection from "../data/testdata";

const ProgramContext = React.createContext();

const defaultProgram = {
  name: "",
  dateStart: null,
  dateEnd: null,
  days: [],
  nextSessionId: 0,
  nextPresentationId: 0,
  nextPresenterId: 0,
  selectedSessionId: 0,
  globalPresenters: [],
};

const ProgramProvider = (props) => {
  const [program, setProgram] = useState(defaultProgram);

  useEffect(() => {
    console.log("Program UseEffect", program);
    if (program.id && program.dateStart) {
      // console.log(`Program.js 28: Would have updated.`,)
      db.update(program)
        .then((x) => {
          console.log("Context > DB Updated ", x);
        })
        .catch((err) => {
          console.error("Context > DB Update failed", err);
        });
    } else if (!program.id && program.dateStart) {
      db.insert(program)
        .then((x) => {
          setProgram({ ...program, id: x });
          console.log("Context > DB Inserted. ID:", x);
        })
        .catch((err) => {
          console.error("Context > DB Insert failed", err);
        });
    } else {
      console.log(`Program.js 39: Missing program.dateStart.`);
    }
  }, [program]);

  //* Initializes a new program
  const createProgram = (newProgram) => {
    setProgram({
      ...program,
      name: newProgram.name,
      dateStart: newProgram.dateStart,
      dateEnd: newProgram.dateEnd,
      days: newProgram.days,
      nextSessionId: 0,
      nextPresentationId: 0,
      nextPresenterId: 0,
      selectedSessionId: 0,
      globalPresenters: [],
    });
  };

  const updateProgram = (program) => {
    console.log(`Program.js 62: `, program.days);
    setProgram(program);
  };

  const editDay = (dayId, dayData) => {
    setProgram({
      ...program,
      days: program.days.map((day) => {
        if (day.id === dayId) {
          // Day we want to modify
          return {
            ...day,
            ...dayData,
          };
        }
        return day;
      }),
    });
  };

  //* Create a session
  const createSession = (newSession) => {
    /*
		  1. Create a new session object and insert into program day
		  2. Inc session id counter and set new session as target for presentations by default
		*/
    const sessionId = program.nextSessionId;
    console.log("CREATE SESSION", newSession, "ID", sessionId);

    setProgram({
      ...program,
      days: program.days.map((day) => {
        if (moment(day.date).isSame(newSession.dateStart, "day")) {
          day.sessions.push({ ...newSession, id: sessionId });
        }

        return day;
      }),
      nextSessionId: program.nextSessionId + 1,
      selectedSessionId: sessionId,
    });
  };

  //* Edit existing session
  const editSession = (sessionId, sessionData) => {
    console.log("EDIT SESSION", sessionId, "=>", sessionData);
    setProgram({
      ...program,
      days: program.days.map((day) => {
        day.sessions = day.sessions.map((session) => {
          if (session.id === sessionId) {
            return {
              ...session,
              ...sessionData,
            };
          }
          return session;
        });

        return day;
      }),
    });
  };

  //* Remove session
  const deleteSession = (sessionId) => {
    console.log("DELETE SESSION", sessionId);
    setProgram({
      ...program,
      days: program.days.map((day) => {
        day.sessions = day.sessions.filter((session) => session.id !== sessionId);

        return day;
      }),
    });
  };

  //* Targets a session for adding a presentation
  const selectSession = (sessionId) => {
    console.log("SELECT SESSION", sessionId);
    setProgram({
      ...program,
      selectedSessionId: sessionId,
    });
  };

  // const selectSessionByPresentationId = (presentationId) => {
  // 	let foundSessionId = -1;

  // 	program.days.some(day => {
  // 		day.sessions.some(session => {
  // 			session.presentations.some(presentation => {
  // 				if (presentation.id === presentationId) {
  // 					foundSessionId = session.id;
  // 					return true;
  // 				}
  // 			});
  // 		});
  // 	});

  // 	if (foundSessionId >= 0) {
  // 		setProgram({
  // 			...program,
  // 			selectedSessionId: foundSessionId
  // 		});
  // 	} else {
  // 		console.log("If you see this then either you broke presentation ids or are searching for an invalid session...");
  // 	}
  // }

  //* Create a new presentation
  const createPresentation = (sessionId, presentation) => {
    // Add presentation to session by id
    console.log("CREATE PRESENTATION FOR SESSION", sessionId, "=>", presentation);

    const presentationId = program.nextPresentationId;

    setProgram({
      ...program,
      days: program.days.map((day) => {
        day.sessions.map((session) => {
          if (session.id === sessionId) {
            session.presentations.push({ ...presentation, id: presentationId });
          }

          return session;
        });
        return day;
      }),
      nextPresentationId: program.nextPresentationId + 1,
    });
  };

  //* Modify existing presentation
  const editPresentation = (presentationId, presentationData) => {
    console.log("EDIT PRESENTATION", presentationId, "=>", presentationData);
    setProgram({
      ...program,
      days: program.days.map((day) => {
        day.sessions = day.sessions.map((session) => {
          session.presentations = session.presentations.map((presentation) => {
            if (presentation.id === presentationId) {
              // Pres we want to modify
              return {
                ...presentation,
                ...presentationData,
              };
            }

            return presentation;
          });

          return session;
        });

        return day;
      }),
    });
  };

  //* Remove presentation
  const deletePresentation = (presentationId) => {
    console.log("DELETE PRESENTATION", presentationId);
    setProgram({
      ...program,
      days: program.days.map((day) => {
        day.sessions = day.sessions.map((session) => {
          session.presentations = session.presentations.filter((presentation) => presentation.id !== presentationId);

          return session;
        });

        return day;
      }),
    });
  };

  //* Add presenter to global list
  const addGlobalPresenter = (presenter) => {
    // Will add a presenter to the global list if he/she doesn't already exist.
    const alreadyExists = program.globalPresenters.includes(presenter);

    if (alreadyExists) return;

    setProgram({
      ...program,
      globalPresenters: [...program.globalPresenters, presenter],
      nextPresenterId: program.nextPresenterId + 1,
    });
  };

  //* Removes a presenter from global list
  const deleteGlobalPresenter = (presenter, force = false) => {
    /*
		  Deletes a presenter from the global list if he/she isn't in use elsewhere in the program by default.
		  force = true -> overrides this and will always delete name from list.
		*/

    // Deletion helper func
    const remove = () => {
      setProgram({
        ...program,
        globalPresenters: program.globalPresenters.filter((p) => (p !== presenter ? true : false)),
      });
    };

    if (force) {
      remove();
    } else {
      // Determine if presenter in use elsewhere in program
      const inUse = program.days.some((day) => {
        return day.sessions.some((session) => {
          return session.presentations.some((presentation) =>
            presentation.presenters.includes(presenter) ? true : false
          );
        });
      });

      if (!inUse) {
        remove();
      }
    }
  };

  //* Increments session counter and returns an id
  const getNextSessionId = () => {
    const id = program.nextSessionId;

    setProgram({ ...program, nextSessionId: program.nextSessionId + 1 });

    return id;
  };

  //* Increments presentation counter and returns an id
  const getNextPresentationId = () => {
    const id = program.nextSessionId;

    setProgram({ ...program, nextSessionId: program.nextSessionId + 1 });

    return id;
  };

  //* Increments presenter counter and returns an id
  const getNextPresenterId = () => {
    const id = program.nextPresenterId;

    setProgram({ ...program, nextPresenterId: program.nextPresenterId + 1 });

    return id;
  };

  //* Returns session by ID
  const getSessionById = (sessionId) => {
    let foundSession = 0;

    // Search for session and break when found
    program.days.some((day) => {
      return day.sessions.some((session) => {
        if (session.id === sessionId) {
          foundSession = session;
          return true;
        }
        return false;
      });
    });

    if (foundSession) {
      return foundSession;
    } else {
      console.log("If you see this then either you broke session ids or are searching for an invalid one...");
    }
  };

  const injectDB = (x) => {
    //
    // Call this method in your code somewhere to put a sample object in the DB.
    //
    // Either pass in a well-shaped program object to inject specific data,
    // OR allow it to use the object defined at the bottom of this file.
    //
    db.insert(x || injection)
      .then((x) => {
        console.log("DB Injection. ID:", x);
      })
      .catch((err) => {
        console.error("DB Injection failed", err);
      });
  };

  const injectTestData = (data) => {
    //
    // Call this method in your code somewhere to put a sample object
    // into the program object in your component.
    //
    // Either pass in a well-shaped program object to inject specific data,
    // OR allow it to use the object imported `from testdata`.
    //
    // SIDEEFFECT: It will write the object to the DB on each refresh.
    // but at least you won't have to manually fill in the program EVERY TIME.
    setProgram(data || injection);
  };

  const loadProgram = async (id) => {
    const read = db.read(id);
    setProgram(await read);
  };

  function handleDnd(t, e) {
    const moveSession = (e) => {
      const { dayIndex, sessionIndex } = e.event.origIndex;
      let working = { ...program };
      let target = working.days[dayIndex].sessions[sessionIndex]; // digging the session out by index
      let origin = working.days[dayIndex]; // getting the origin day

      const checkDrop = rangeCheck(e);
      if (!checkDrop.ok) {
        return;
      }

      target = {
        ...target,
        dateStart: `${moment(e.start).format()}`,
        dateEnd: `${moment(e.end).format()}`,
      };

      const dayDrop = working.days.map((d) => d.id).indexOf(checkDrop.newDayId);

      const destination = working.days[dayDrop].sessions;
      destination.push(target);
      origin.sessions.splice(sessionIndex, 1);

      setProgram({ ...working });
    };

    const movePresentation = (e) => {
      const { dayIndex, sessionIndex, presIndex } = e.event.origIndex;
      // const { dayId, sessionId, presId } = e.event.origData
      let working = { ...program };
      let target = working.days[dayIndex].sessions[sessionIndex].presentations[presIndex]; // digging the pres out by index
      let origin = working.days[dayIndex].sessions[sessionIndex]; // getting the origin session

      const checkDrop = rangeCheck(e);
      if (!checkDrop.ok) {
        return;
      }

      target = {
        ...target,
        dateStart: `${moment(e.start).format()}`,
        dateEnd: `${moment(e.end).format()}`,
      };

      const dayDrop = working.days.map((d) => d.id).indexOf(checkDrop.newDayId);
      const sessionDrop = working.days[dayDrop].sessions.map((s) => s.id).indexOf(checkDrop.newSessionId);

      const destination = working.days[dayDrop].sessions[sessionDrop].presentations;
      destination.push(target);
      origin.presentations.splice(presIndex, 1);

      setProgram({ ...working });
    };

    const rangeCheck = (e) => {
      const { type } = e.event;
      // const dayRange = [program.dateStart, program.dateEnd];
      // const dayCount = moment(program.dateEnd).diff(moment(program.dateStart));
      const sessionRange = [];

      for (const pDay of program.days) {
        for (const pSession of pDay.sessions) {
          sessionRange.push([pSession.dateStart, pSession.dateEnd, pSession.id, pDay.id]);
        }
      }

      if (type === "session") {
        for (const day of program.days) {
          const chkDayDate = moment(e.start).format("DD MM YYYY") === moment(day.date).format("DD MM YYYY");
          if (chkDayDate) {
            const send = {
              ok: true,
              newDayId: day.id,
            };
            return send;
          }
        }
      }

      if (type === "presentation") {
        for (const range of sessionRange) {
          const chkStart = moment(e.start).isBetween(range[0], range[1], "minute", "[]");
          const chkEnd = moment(e.end).isBetween(range[0], range[1], "minute", "[]");
          if (chkStart && chkEnd) {
            const send = {
              ok: true,
              newSessionId: range[2],
              newDayId: range[3],
            };
            return send;
          }
        }
      }
      return {
        ok: false,
        newSessionId: -1,
        newDayId: -1,
      };
    };

    switch (t) {
      case "onDragStart":
        // console.log(`onDragStart: `, e)
        break;

      case "onEventDrop":
        // console.log(`onEventDrop: `, e.event.type)
        // const type = e.event.type === "session" ? moveSession(e) : movePresentation(e);
        e.event.type === "session" ? moveSession(e) : movePresentation(e);

        break;

      default:
        console.log(`handleDnd fallthru ${t}`, e);
        break;
    }
  }

  return (
    <ProgramContext.Provider
      value={{
        ...program,
        createProgram,
        updateProgram,
        editDay,
        createSession,
        editSession,
        deleteSession,
        selectSession,
        getSessionById,
        getNextSessionId,
        getNextPresentationId,
        // selectSessionByPresentationId,
        createPresentation,
        editPresentation,
        deletePresentation,
        getNextPresenterId,
        addGlobalPresenter,
        deleteGlobalPresenter,
        handleDnd,
        loadProgram,
        // clearProgram,
        //Dev Only. call directly in a component when...
        // ...you need a DB entry.
        injectDB,
        // ...you need test data in your component.
        injectTestData,
      }}>
      {props.children}
    </ProgramContext.Provider>
  );
};

export { ProgramProvider, ProgramContext };
