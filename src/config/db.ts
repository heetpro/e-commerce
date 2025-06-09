import mongoose from "mongoose"
import dotenv from "dotenv"
import { config } from "./config"

dotenv.config()

export const connectDB = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    }
    catch (error) {
        console.error("Database connection failed:",error);
        process.exit(1);
    }
}