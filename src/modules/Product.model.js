import mongoose, { Schema } from "mongoose";

const productSchema= new Schema({
    name:{
        type:String,
        required:true,
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
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
    }],
    categoryName:{
        type:String
    },
    rating:{
        type:Number,
    }
})



export const Product= mongoose.model("Product",productSchema)