import mongoose from "mongoose";


const connectDB=async()=>{
    mongoose.connection.on('connected',()=>console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
        ssl: true
    });
}

const closeDatabase = async()=>{
    console.log("db called!");
}

export {connectDB, closeDatabase}
