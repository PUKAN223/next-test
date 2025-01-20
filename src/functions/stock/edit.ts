'use server'
import ContainerProps from "@/props/Containers"
import ConnectDB from "../mongodbConnect"
import Container from "@/schemas/mongoDB/Containers"

export async function editContainers(d: ContainerProps, id: string) {
    await ConnectDB()
    await Container.collection.findOneAndUpdate({ _id: new Object(id) }, d)
    return true
}
