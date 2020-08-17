import React, { useState, useEffect } from "react";

import db from "../data/database"

const ProgramContext = React.createContext();

const defaultProgram = {
	name: "",
	dateStart: null,
	dateEnd: null,
	days: [],
	sessions: [],
	nextSessionId: 0,
	tempSession: {},
}
const ProgramProvider = (props) => {
	const [program, setProgram] = useState(defaultProgram);

	useEffect(() => {
		conlog("Context Changed", program)
		if (program.id && program.dateStart) {
			db.update(program)
				.then((x) => {
					// program.id = x
					console.log("Context > DB Updated ", x)
				})
				.catch((err) => {
					console.error("Context > DB Update failed", err)
				})
		} else if (!program.id && program.dateStart) {
			db.insert(program)
				.then((x) => {
					setProgram({...program, id: x })
					console.log("Context > DB Inserted. ID:", x)
				})
				.catch((err) => {
					console.error("Context > DB Insert failed", err)
				})
		} else {
			console.log(`Program.js 39: Missing program.dateStart.`, )
		}
	}, [program]);

	const createProgram = (programInfo) => {
		setProgram({
			...program,
			name: programInfo.name,
			dateStart: programInfo.dateStart,
			dateEnd: programInfo.dateEnd,
			days: programInfo.days,
		});
	};

	const modifyTempSession = (session) => {
		setProgram({
			...program,
			tempSession: {
				...program.tempSession,
				...session,
			},
		});
	};

	const addSession = (session) => {
		setProgram({
			...program,
			sessions: [...program.sessions, { ...session, id: program.nextSessionId }],
			nextSessionId: program.nextSessionId + 1,
		});
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
	}

	return (
		<ProgramContext.Provider
			value={{ ...program, createProgram, addSession, editSession, deleteSession, modifyTempSession, clearProgram }}>
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