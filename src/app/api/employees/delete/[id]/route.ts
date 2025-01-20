import ConnectDB from "@/functions/mongodbConnect"
import { ObjectId } from "mongodb"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const client = await ConnectDB()
    const db = client.db("employee")
    const coll = db.collection("user")
    const { id } = await  params
    const result = coll.findOneAndDelete({ _id: new ObjectId(id) })
    return Response.json({ data: result }, { status: 200 })
}