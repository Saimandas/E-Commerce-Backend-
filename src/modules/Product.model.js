import mongoose, { Schema } from "mongoose";

const productSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:0
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

export const Product= mongoose.model("Product",productSchema)