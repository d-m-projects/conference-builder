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
		// debugger
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
	
	const loadProgram = async (id) => {
		const read = db.read(id)
		setProgram(await read);
	}

	const clearProgram = () => {
		db.clean();
		setProgram(defaultProgram);
	}

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

	return (
		<ProgramContext.Provider
			value={{ ...program, createProgram, addSession, editSession, deleteSession, modifyTempSession, loadProgram, injectDB}}>
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
var injection = {
	name: "Default DB Injection",
	dateStart: "2020-08-18T8:00:00.00Z",
	dateEnd: "2020-08-21T22:00:00.00Z",
	days: [
		{
			date: "2020-08-18T13:01:00.00Z",
			sessions: [
				{
					name: "Toughjoyfax",
					dateStart: "2020-08-18T16:00:00.00Z",
					dateEnd: "2020-08-18T19:00:00.00Z",
					presentations: [
						{
							name: "Lotlux",
							presenters: ["Moss Jowling", "Tera Faldoe"],
							creditTypes: ["AMA", "ATE"],
							creditValues: [0.25, 0.25],
						},
						{
							name: "Veribet",
							presenters: ["Hyacintha Quiddihy", "Janine Laraway", "Darryl Fardo"],
							creditTypes: ["AMA", "ATE"],
							creditValues: [0.25, 0.25],
						},
					],
					id: 0,
				},
				{
					name: "Keylex",
					dateStart: "2020-08-18T17:00:00.00Z",
					dateEnd: "2020-08-18T19:00:00.00Z",
					presentations: [
						{
							name: "Konklab",
							presenters: ["Niccolo Knill", "Artemas Ramsby", "Catarina Millington", "Munroe Haskey"],
							creditTypes: ["AMA"],
							creditValues: [0.5,],
						},
					],
					id: 1,
				},
			]
		},
		{
			date: "2020-08-19T13:11:00.00Z",
			sessions: [
				{
					name: "Aerified",
					dateStart: "2020-08-19T12:00:00.00Z",
					dateEnd: "2020-08-19T13:00:00.00Z",
					presentations: [
						{
							name: "Zaam-Dox",
							presenters: ["Phillipp Fyrth", "Ricca Leary"],
							creditTypes: ["AFAIC"],
							creditValues: [0.25, 0.25],
						},
						{
							name: "Transcof",
							presenters: ["Antonetta Fidelli", "Oran Cawt"],
							creditTypes: ["Lunch", "TIL"],
							creditValues: [0.25, 0.25],
						},
					],
					id: 2,
				},
			],
		},
		{
			date: "2020-08-20T13:22:00.00Z",
			sessions: [
			],
		},
		{
			date: "2020-08-21T13:33:00.00Z",
			sessions: [
			],
		},
	],
};