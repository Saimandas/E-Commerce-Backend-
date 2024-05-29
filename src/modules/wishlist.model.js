import mongoose from "mongoose";

const cartSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

export const Cart= mongoose.model("Cart",cartSchema)