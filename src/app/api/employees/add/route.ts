import ConnectDB from "@/functions/mongodbConnect"
import Employees from "@/props/Employees"

export async function POST(req: Request, _res: Response) {
    const client = await ConnectDB()
    const db = client.db("employee")
    const coll = db.collection("user")

    const requestData: Employees = await req.json()
    
    if (!requestData) return Response.json({ error: "Missing Field."}, { status: 401 })

    const result = await coll.insertOne(requestData)
    return Response.json({ data: result }, { status: 200 })
}