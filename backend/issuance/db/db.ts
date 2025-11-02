import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, {

        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

const closeDatabase = async () => {
    console.log("db called!");
    await mongoose.connection.close();
}

export { connectDB, closeDatabase }
