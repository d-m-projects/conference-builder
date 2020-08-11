import Dexie from "dexie"

const db = new Dexie("programs")
db.version(1).stores({
	programs: "id, name, dateStart, dateEnd, days"
})

db.start = () => {
	db.open()
		.then((x) => {
			conlog(">>> Opened: ", x.name)
		})
		.catch((err) => {
			console.error(">>> Open error: ", (err.stack || err))
		})
}

db.insert = (data) => {
	const action = db.programs.add(data)
		.then((x) => {
			conlog(">>> Insert: ", x )
		})
		.catch((err) => {
			console.error(">>> Insert error: ", err);
		})

	return action
}

db.read = (data) => {
	return db.programs.get(data)
		.then((x) => {
			if (x) {
				conlog(">>> Read: ", data, x)
				return x
			}
			return 0
		})
		.catch((err) => {
			console.error(">>> Read error: ", err);
		})

}

db.update = (data) => {
	conlog("D STOP", data)

	return db.programs.put(data)
		.then((x) => {
			conlog(">>>D Updated", x, data)
		})
		.catch((err) => {
			console.error(">>>D Update error", data, err)
		})

}

db.clean = () => {
	const action = db.delete()
		.then((x) => {
			conlog(">>> Cleaned", x);
		})
		.catch((err) => {
			console.error(">>> Clean error:", err);
		})

	return action
}
export default db

function conlog() {
	for (const arg in arguments) {
		console.dir(arguments[arg]);
	}
	console.log("__________")
}