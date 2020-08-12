import Dexie from "dexie"

const db = new Dexie("programs_db")
db.version(1).stores({
	programs: "id"
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
				x=JSON.parse(x.object)
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
	const dataString = {id: 1, object: JSON.stringify(data)}
	return db.programs.put(dataString, 1)
		.then((x) => {
			conlog(">>>D Updated", x, dataString)
			return x;
		})
		.catch((err) => {
			console.error(">>>D Update error", dataString, err)
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
	console.log("____DB____")
	for (const arg in arguments) {
		console.dir(arguments[arg]);
	}
	console.log("^^^^^^^^^^")
}