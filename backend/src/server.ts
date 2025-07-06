import dotenv from "dotenv"
import express from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import contentRoutes from "./routes/content.routes";

dotenv.config()

// Initialize Express app
const app = express()

app.use(cookieParser())
app.use(express.json())

// Set up routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/content", contentRoutes)

async function startServer() {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log(`Server is running on ${process.env.BACKEND_URL}`)
        });
    } catch (err) {
        console.error("Failed to connect to database. Server not started.");
        process.exit(1);
    }
}

startServer()