import React, { useState, useEffect } from "react";

import moment from "moment";

import db from "../data/database";

// Dev test data
import injection from "../data/testdata"

const ProgramContext = React.createContext();

const defaultProgram = {
  name: "",
  dateStart: null,
  dateEnd: null,
  days: [],
  nextSessionId: 0,
  selectedSessionId: 0,
  globalPresenters: [],
  nextPresenterId: 0,
};

const ProgramProvider = (props) => {
	const [program, setProgram] = useState(defaultProgram);

  useEffect(() => {
		if (program.id && program.dateStart) {
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

	const createProgram = (newProgram) => {
		setProgram({
			...program,
			name: newProgram.name,
			dateStart: newProgram.dateStart,
			dateEnd: newProgram.dateEnd,
      days: newProgram.days,
      nextSessionId: 0,
      nextPresenterId: 0,
      selectedSessionId: 0,
      globalPresenters: []
		});
	};

	const updateProgram = (program) => {
		console.log(`Program.js 62: `, program.days)
		setProgram(program)
	};

	const createSession = (newSession) => {
    /*
      1. Create a new session object and insert into program day
      2. Inc session id counter and set new session as target for presentations by default
    */

    const sessionId = program.nextSessionId;

    setProgram({
      ...program,
      days: program.days.map((day) => {
        if (moment(day.date).dayOfYear() === moment(newSession.dateStart).dayOfYear()) {
          return { ...day, sessions: [...day.sessions, { ...newSession, id: sessionId }] };
        }
        return day;
      }),
      nextSessionId: program.nextSessionId + 1,
      selectedSessionId: sessionId,
    });
  };

  const editSession = (sessionId, sessionData) => {
    setProgram({
      ...program,
      days: program.days.map(day => {
        day.sessions = day.sessions.map(session => {
          if (session.id === sessionId){
            // Session we want to modify
            // console.log(program.selectedSessionId, "Context modified", session.name , "=>", sessionData.name)
            return {
              ...session,
              name: sessionData.name,
              dateStart: sessionData.dateStart,
              dateEnd: sessionData.dateEnd
            }
          }
          return session;
        });

        return day;
      })
    });
  }

  const deleteSession = (sessionId) => {
    setProgram({
      ...program,
      days: program.days.map((day) => {
        day.sessions = day.sessions.filter(session => session.id !== sessionId);

        return day;
      })
    });
  }

  const selectSession = (sessionId) => {
    setProgram({
      ...program,
      selectedSessionId: sessionId
    });
  }

  const selectSessionByPresentationId = (presentationId) => {
    let foundSessionId = -1;
  
    program.days.some(day => {
      day.sessions.some(session => {
        session.presentations.some(presentation => {
          if (presentation.id === presentationId) {
            foundSessionId = session.id;
            return true;
          }
        });
      });
    });

    if (foundSessionId >= 0) {
      setProgram({
        ...program,
        selectedSessionId: foundSessionId
      });
    } else {
      console.log("If you see this then either you broke presentation ids or are searching for an invalid session...");
    }
  }

  const createPresentation = (sessionId, presentation) => {
    // Add presentation to session by id

    setProgram({
      ...program,
      days: program.days.map(day => {
        day.sessions.map(session => {
          if (session.id === sessionId) {
            session.presentations.push(presentation);
          }

          return session;
        });
        return day;
      }),
    });
  };

  const editPresentation = (presentationId, presentationData) => {
    setProgram({
      ...program,
      days: program.days.map(day => {
        day.sessions = day.sessions.map(session => {
          session.presentations = session.presentations.map(presentation => {
            if (presentation.id === presentationId) {
              // Pres we want to modify
              return {
                ...presentation,
                ...presentationData
              }
            }

            return presentation;
          })

          return session;
        })
      
        return day;
      })
    })
  }

  const deletePresentation = (presentationId) => {
    setProgram({
      ...program,
      days: program.days.map(day => {
        day.sessions = day.sessions.map(session => {
          session.presentations = session.presentations.filter(presentation => presentation.id !== presentationId);

          return session;
        });

        return day;
      })
    });
  }

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
      // Using .some will break the looping on first truthy return so it's faster
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

  const getNextPresenterId = () => {
    // Getter for a unique presenter id.
    const id = program.nextPresenterId;

    setProgram({ ...program, nextPresenterId: program.nextPresenterId + 1 });

    return id;
  };

  const getSessionById = (sessionId) => {
    let foundSession = 0;

    // Using .some will break the looping on first truthy return so it's faster
    program.days.some((day) => {
      return day.sessions.some((session) => {
        if (session.id === sessionId) {
          foundSession = session;
          return true;
        }
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
				console.log("DB Injection. ID:", x)
			})
			.catch((err) => {
				console.error("DB Injection failed", err)
			})
	}

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
		setProgram(data || injection)
	}

	const loadProgram = async (id) => {
		const read = db.read(id);
		setProgram(await read);
	};

	function handleDnd(t, e) {
		const moveSession = (e) => {
			const { day, session } = e.event.origKeys
			let target = program.days[day].sessions[session]

			if (!rangeCheck(e)) { return }

			const updateSessionTimes = {
				...target,
				dateStart: `${moment(e.start).format()}`,
				dateEnd: `${moment(e.end).format()}`,
			}

			program.days[day].sessions.splice(
				session,
				1,
				updateSessionTimes
			);

			setProgram({ ...program })
		}

		const movePresentation = (e) => {
			const { day, session, pres } = e.event.origKeys
			let target = program.days[day].sessions[session].presentations[pres]

			if (!rangeCheck(e)) { return }

			const updatePresTimes = {
				...target,
				dateStart: `${moment(e.start).format()}`,
				dateEnd: `${moment(e.end).format()}`,
			}
			program.days[day].sessions[session].presentations.splice(
				pres,
				1,
				updatePresTimes
			);

			setProgram({ ...program })
		}

		const rangeCheck = (e) => {
			const { type, origKeys: { day, session, pres } } = e.event
			const dayRange = [program.dateStart, program.dateEnd]
			const sessionRange = []

			for (const pDay of program.days) {
				for (const pSession of pDay.sessions) {
					sessionRange.push([pSession.dateStart, pSession.dateEnd])
				}
			}

			if (type === "session") {
				const chkStart =
					moment(e.start)
						.isBetween(dayRange[0], dayRange[1], "day", "[]")
				const chkEnd =
					moment(e.end)
						.isBetween(dayRange[0], dayRange[1], "day", "[]")
				if (chkStart && chkEnd) return true;
			}

			if (type === "presentation") {
				for (const range of sessionRange) {
					const chkStart =
						moment(e.start)
							.isBetween(range[0], range[1], "minute", "[]")
					const chkEnd =
						moment(e.end)
							.isBetween(range[0], range[1], "minute", "[]")
					if (chkStart && chkEnd) return true;
				}
			}
			return false
		}

		switch (t) {
			case "onDragStart":
				// console.log(`onDragStart: `, e)
				break;

			case "onEventDrop":
				// console.log(`onEventDrop: `, e.event.type)
				const type =
					e.event.type === "session"
						? moveSession(e)
						: movePresentation(e)

				break;

			default:
				console.log(`handleDnd fallthru ${t}`, e)
				break;
		}
	}


	return (
		<ProgramContext.Provider
			value={{
				...program,
        createProgram,
				updateProgram,
        createSession,
        editSession,
        deleteSession,
        selectSession,
        getSessionById,
        selectSessionByPresentationId,
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

