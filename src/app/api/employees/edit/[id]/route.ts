import ConnectDB from "@/functions/mongodbConnect"
import Employees from "@/props/Employees"
import { ObjectId } from "mongodb"


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }>}) {
    const client = await ConnectDB()
    const db = client.db("employee")
    const coll = db.collection("user")
    const { id } = await params
    const data: Employees = await req.json()

    const result = await coll.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data })
    return Response.json({ data: result }, { status: 200 })
}