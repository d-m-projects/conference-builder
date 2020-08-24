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
};

const ProgramProvider = (props) => {
	const [program, setProgram] = useState(defaultProgram);

	useEffect(() => {
		conlog("Context Changed", program);
		if (program.id && program.dateStart) {
			db.update(program)
				.then((x) => {
					// program.id = x
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
		});
	};

	const createSession = (newSession) => {
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

	const deleteSession = (session) => {
		// setProgram({
		// 	...program,
		// 	sessions: program.sessions.filter((event) => {
		// 		if (event.id !== session.id) {
		// 			return true;
		// 		}
		// 	}),
		// });
	};

	const editSession = (modifiedSession) => {
		// setProgram({
		// 	...program,
		// 	sessions: program.sessions.map((session) => {
		// 		if (session.id === modifiedSession.id) {
		// 			return modifiedSession;
		// 		}
		// 		return session;
		// 	}),
		// });
	};

	const createPresentation = (sessionId, newPresentation) => {
		setProgram({
			...program,
			days: program.days.map((day) => {
				day.sessions.map((session) => {
					if (session.id === sessionId) {
						session.presentations.push(newPresentation);
					}

					return session;
				});
				return day;
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

	const getSessionById = (sessionId) => {
    let foundSession = null;

    program.days.some(day => {
      return day.sessions.some(session => {
        if (session.id === sessionId){
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

	// No longer necessary?
	// const clearProgram = () => {
	// 	db.clean();
	// 	setProgram(defaultProgram);
	// };

	return (
		<ProgramContext.Provider
			value={{
				...program,
				createProgram,
				createSession,
				getSessionById,
				editSession,
				deleteSession,
				createPresentation,
				addGlobalPresenter,
				deleteGlobalPresenter,
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

function conlog() {
	const show = false
	if (show) {
		console.log("__Program_")
		for (const arg in arguments) {
			console.dir(arguments[arg]);
		}
		console.log("^^^^^^^^^^")
	}
}

// use var here to ensure hoisting
