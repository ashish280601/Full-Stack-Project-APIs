import mongoose from "mongoose";

const url = process.env.MONGODB_URL;

export const connectDB = async (req, res) => {
    try {
        await mongoose.connect(url);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting with database", error.message);
        
    }
}