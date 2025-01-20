import ConnectDB from "@/functions/mongodbConnect"

export async function PUT() {
    return Response.json({ error: "Require Id"}, { status: 200 })
}