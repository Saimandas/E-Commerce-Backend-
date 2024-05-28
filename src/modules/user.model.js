import mongoose, { Schema } from "mongoose";

const userSchema= new Schema({

    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true
    },
    avatar:{
        type:String
    },
    refreshToken:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

export const User= mongoose.model("User",userSchema)