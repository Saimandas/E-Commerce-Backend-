import mongoose,{Schema} from "mongoose";

const wishListSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }
})

export const WishList= mongoose.model("WishList",wishListSchema)