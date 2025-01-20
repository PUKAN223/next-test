import ConnectDB from "@/functions/mongodbConnect"

export async function GET() {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("histories")
    
    const result = await coll.find().toArray()
    return Response.json({ data: result }, { status: 200 })
}