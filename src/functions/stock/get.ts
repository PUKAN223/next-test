'use server'

import Container from "@/schemas/mongoDB/Containers"
import ConnectDB from "../mongodbConnect"
import { ObjectId } from "mongodb"
import ContainerProps from "@/props/Containers"

export async function getAllContainers() {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    
    const containers = await coll.find().toArray()

    return containers
}

export async function getContainers(id: string) {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    
    const containers = await coll.find({ _id: new ObjectId(id) }).toArray()
    
    return (containers).map((container) => ({
        ...container,
        _id: container._id.toString()
    }))
}
