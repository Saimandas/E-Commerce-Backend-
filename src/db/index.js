import mongoose from "mongoose";



export async function connectDB(){
    try {
        const response= await mongoose.connect(process.env.DB_URI)
    } catch (error) {
        console.log("db connection failed",error);
        process.exit(1)
    }
   
}