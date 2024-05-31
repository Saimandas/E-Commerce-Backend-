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
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default:"buyer"
    },
    storeAddress: {
        type: String,
        required: function() { return this.role === 'seller'; }
    },
    storeName: {
        type: String,
        required: function() { return this.role === 'seller'; }
    },
    
    contactInfo: {
        type: String,
        required: function() { return this.role === 'seller'; }
    },
})

export const User= mongoose.model("User",userSchema)