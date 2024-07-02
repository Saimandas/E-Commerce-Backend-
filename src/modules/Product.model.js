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
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    stock:{
        type:Number,
        required:true,
        default:10
    },
    avilableStock:{
        type:Number,
    },
    productImg:[{
        type:String,
        required:true
    }]
})

export const Product= mongoose.model("Product",productSchema)