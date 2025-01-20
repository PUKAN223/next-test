import ConnectDB from "@/functions/mongodbConnect"

export async function GET() {
    const client = await ConnectDB()
    const db = client.db("stock")
    const coll = db.collection("containers")
    const containers = await coll.find().toArray()

    return Response.json(containers, { status: 200 })
}