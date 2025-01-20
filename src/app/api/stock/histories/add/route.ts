import ConnectDB from "@/functions/mongodbConnect"
import Container from "@/props/Containers"

export async function POST(req: Request, res: Response) {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("histories")

    const requestData: Container = await req.json()
    
    if (!requestData) return Response.json({ error: "Missing Field."}, { status: 401 })

    const result = await coll.insertOne(requestData)
    return Response.json({ data: result }, { status: 200 })
}