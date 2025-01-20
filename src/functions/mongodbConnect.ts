import { MongoClient } from "mongodb"

export default async function ConnectDB() {
    const db = new MongoClient(process.env.MONGO_DB)
    await db.connect()
    return db
}