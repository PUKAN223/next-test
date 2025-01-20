"use server"

import mongoose from "mongoose"

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("Connected Database.")
    } catch (e) {
        console.error("Failed to Connect DB")
    }
}