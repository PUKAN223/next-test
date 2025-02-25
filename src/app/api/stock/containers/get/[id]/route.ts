import ConnectDB from "@/functions/mongodbConnect"
import { ObjectId } from "mongodb"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }>}) {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    const { id } = await params
    try {
        const containers = await coll.find({ _id: new ObjectId(id)}).toArray()
        return Response.json(containers[0], { status: 200 })
    } catch(_e) {
        return Response.json({ error: `No Containers Id: ${id}` }, { status: 401 })
    }
}