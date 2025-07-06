import mongoose from "mongoose"

export const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI
    if (!mongoURI) {
        throw new Error("MONGO_URI environment variable is not set. Please check your .env file.");
    }
    try {
        await mongoose.connect(mongoURI)
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}