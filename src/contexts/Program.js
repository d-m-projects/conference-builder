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

	// const editSession = (session) => {
	// 	// TODO Add functionality to edit existing session
	// };

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

	const tooManyTabs = () => {
		
	}

	return (
		<ProgramContext.Provider
			value={{ ...program, createProgram, addSession, editSession, deleteSession, modifyTempSession, loadProgress, clearProgram }}>
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