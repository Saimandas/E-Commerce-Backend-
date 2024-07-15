import mongoose, { Schema } from "mongoose";

const orderSchema= new Schema({
    Price:{
        type:Number,
        required:true
    },
    finalPrice:{
      type:Number,
      required:true
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    orderItem:[{
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    }
    }],
    // sellerId:{
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref:"User"
    // },
    shippingInfo: {
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        pinCode: {
          type: Number,
          required: true,
        },
      },
      discount: {
        type: Number,
        default:0
      },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIVERED"],
        default:"PENDING"
    }
})

export const Order= mongoose.model("Order",orderSchema)