import Dexie from "dexie"

const db = new Dexie("programs")
db.version(1).stores({
	programs: "++id, name, dateStart, dateEnd, days"
})

db.insert = (data) => {
	return db.programs.put(data)
	.catch((err) => {
		console.error(`>>>Insert error: `, err);
	})
}

export default db