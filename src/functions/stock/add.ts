'use server'

import Containers from "@/schemas/mongoDB/Containers"
import ConnectDB from "../mongodbConnect"
import { randomCode } from "../randomCode"
import Container from "@/props/Containers"

export async function addContainers(data: Container) {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    await coll.insertOne(data)
    return true
}