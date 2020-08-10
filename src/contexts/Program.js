import React, { useState, useEffect } from "react";

import db from "../data/database"

const ProgramContext = React.createContext();

const defaultProgram = {
	id: 1,
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
		console.log("Context Changed", program)
		if (program.dateStart) {
			db.update(program)
				.then((x) => {
					console.log(`Program.js 23: `, x)
				})
				.catch((err) => {
					console.log(`Context > DB update failed`, err)
				})
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

	const loadProgress = (programInfo) => {
		setProgram(programInfo);
	}

	const clearProgram = () => {
		db.clean();
		setProgram(defaultProgram);
	}

	return (
		<ProgramContext.Provider
			value={{ ...program, createProgram, addSession, editSession, deleteSession, modifyTempSession, loadProgress, clearProgram }}>
			{props.children}
		</ProgramContext.Provider>
	);
};

export { ProgramProvider, ProgramContext };
