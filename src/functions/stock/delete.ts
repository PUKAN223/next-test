'use server'

import Container from "@/schemas/mongoDB/Containers"
import ConnectDB from "../mongodbConnect"
import { ObjectId } from "mongodb"  

export async function deleteContainers(id: string[]) {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    id.forEach(d => {
        coll.deleteOne({ _id: new ObjectId(d) })
    })
    return true
}