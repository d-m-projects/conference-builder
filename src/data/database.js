import Dexie from "dexie"

const db = new Dexie("programs_db")
db.version(1).stores({
	programs: "id"
})

db.start = () => {
	db.open()
		.then((x) => {
			conlog(">>> DB Opened: ", x.name)
		})
		.catch((err) => {
			console.error(">>> DB Open error: ", (err.stack || err))
		})
}

db.read = (data) => {
	return db.programs.get(data)
		.then((x) => {
			if (x) {
				// x = JSON.parse(x.object)
				conlog(">>> DB Read:", data, x)
				return x
			}
			return 0
		})
		.catch((err) => {
			console.error(">>> DB Read error: ", err);
		})
}

db.update = (data) => {
	// const dataString = { id: 1, object: JSON.stringify(data) }
	return db.programs.put(data, 1)
		.then((x) => {
			conlog(">>> DB Updated:", x, data)
			return x;
		})
		.catch((err) => {
			console.error(">>> DB Update error", data, err)
		})
}

db.clean = () => {
	const action = db.delete()
		.then((x) => {
			conlog(">>> DB Cleaned", x);
		})
		.catch((err) => {
			console.error(">>> DB Clean error:", err);
		})

	return action
}

export default db

function conlog() {
	const show = false
	if (show) {
		console.log("____DB____")
		for (const arg in arguments) {
			console.dir(arguments[arg]);
		}
		console.log("^^^^^^^^^^")
	} else {
		console.log(...arguments)
	}
}