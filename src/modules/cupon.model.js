import mongoose from "mongoose";

const cuponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter the Coupon Code"],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "Please enter the Discount Amount"],
  },
  minAmount:{
    type:Number,
    required:true
  }
});

export const Coupon = mongoose.model("Coupon", cuponSchema);