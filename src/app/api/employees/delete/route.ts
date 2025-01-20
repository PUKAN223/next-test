import ConnectDB from "@/functions/mongodbConnect"

export async function DELETE() {
    return Response.json({ error: "Required Id" }, { status: 401 })
}