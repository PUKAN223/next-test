import ConnectDB from "@/functions/mongodbConnect"
import Container from "@/props/Containers"
import { ObjectId } from "mongodb"


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }>}) {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    const { id } = await params
    const data: Container = await req.json()

    const result = await coll.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data })
    return Response.json({ data: result }, { status: 200 })
}