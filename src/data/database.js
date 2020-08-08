import Dexie from "dexie"

const db = new Dexie("programs")
db.version(1).stores({
	programs: "++id, name, dateStart, dateEnd, days"
})

db.insert = (data) => {
	db.open()
		.then((x) => {
			console.log(">>> Opened: ", x.name)
		})
		.catch((err) => {
			console.error(">>> Open error: ", (err.stack || err))
		})

	const action = db.programs.add(data)
	.then((x) => {
		console.log(">>> Started: ", x)
	})
	.catch((err) => {
		console.error(`>>> Insert error: `, err);
	})

	return action
}

db.update = (data) => {
	const action = db.programs.put(data)
	.then((x) => {
		console.log(">>> Updated: ", x, data)
	})
	.catch((err) => {
		console.error(`>>> Update error: `, err);
	})

	return action
}

db.clean = () => {
	const action = db.delete()
	.then((x) => {
		console.log(">>> Cleaned", x);
	})
	.catch((err) => {
		console.error(">>> Clean error:", err);
	})

	return action
}
export default db