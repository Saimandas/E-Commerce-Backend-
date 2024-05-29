import { User } from "../modules/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import uploadFile from "../utils/cloudnary.js";
import { z } from "zod";
import {signUpSchema} from '../schema/signUpSchema.js'
const register= async (req,res)=>{
    try {
      const {username,email,password,role}=req.body;
      const user = await User.findOne({
        $or:[{username},{email},{password}]
      })
      if (user) {
       return res.status(400).json({
        message:"user already exists"
       })
      }

      const multerUrl= req.file?.path
      const avatarUrl=await uploadFile(multerUrl);
      if (!avatarUrl) {
        return res.status(500).json({message:"Failed to upload image"})
      }

      const salt= await bcryptjs.genSalt(10)
      const hashedPassword= await bcryptjs.hash(password,salt)
      const newUser= new User({
        email,username,password:hashedPassword,avatar:avatarUrl,
        role,
            ...(role === 'seller' && {
                storeName: req.body.storeName,
                storeAddress: req.body.storeAddress,
                contactInfo: req.body.contactInfo,
            }),
      })

      const savedUser= await newUser.save()
      if (!savedUser) {
      throw new ApiError(500,"failed to save the user")
      }
  
      return res.status(200).json(
        new ApiResponse("user registered succesfullt",savedUser)
      )


    } catch (error) {
      return res.status(500).json({
        message:"something went wrong",error
       })
    }
}

const login=async(req,res)=>{
  try {
    const {email,password}= req.body
    const user= await User.findOne({email})
    if (!user) {
      return res.status(400).json({
        message:"user doesn't exists"
       })
    }
    const isPasswordCorrect= await bcryptjs.compare(password,user.password)
    if (!isPasswordCorrect) {
      return res.status(402).json({
        message:"password is incorrect"
       })
    }

    const tokenData= {
      _id:user._id
    }
    const accesToken= await Jwt.sign(tokenData,process.env.ACCES_TOKEN_SECERT,{expiresIn:"2d"})
    const refereshToken= await Jwt.sign(tokenData,process.env.REFRESH_TOKEN_SECERT)
    const savedUser= await User.findByIdAndUpdate(user._id,{
      refreshToken:refereshToken
    })
    const option={
      httpOnly:true,
      secure:true
    }
    return res.status(200)
    .cookie("accesToken",accesToken,option)
    .cookie("refreshToken",refereshToken,option)
    .json(
      new ApiResponse("user logged in succesfully")
    )

  } catch (error) {
    return res.status(500).json({
      message:"something went wrong"
    })
  }
}
const logout= async (req,res)=>{
  try {
    
    const userId= req.userId
    const user= await User.findByIdAndUpdate(userId,{
      refreshToken:null
    })
    if (!user) {
      return res.status(400).json("cant get the user")
    }
    const option={
      httpOnly:true,
      secure:true
    }

    res.status(200)
    .clearCookie("accesToken",option)
    .clearCookie("refreshToken",option)
    .json(
      new ApiResponse("user logout succesfully")
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json({messsage:"Something went wrong",error})
  }
}

const getCurrentUser= async (req,res)=>{
 try {
  const userId= req.userId;
  const user= await User.findById(userId).select(" -password ")
  if (!user) {
    return res.status(400).json(
      new ApiResponse("user not avilable")
    )
  }
  return res.status(200).json(
    new ApiResponse("user get succesfully",user)
  )
 } catch (error) {
  return res.status(500).json({
    message:"something went wrong"
  })
 }
}

const checkSignUp= async (req,res)=>{
  try {
    const signUpQuery= z.object({
      signUp:signUpSchema
    })
    const {username,password,email}=req.body;
    const userData= {
      signUp:{username,password,email}
    }
    const result = await signUpQuery.safeParse(userData)
    
    if (!result.success) {
      const formatedMsg=result.error.format()
      const errMsg= Object.values(formatedMsg.signUp||"").map((e)=>e._errors)
      console.log(errMsg.map((e,i)=>e))
      return res.status(401).json({
        succes:false,
        usernameMessage:errMsg.length>0?(errMsg[0]===undefined?"":errMsg[0].toString())
        :"invalid query params",
        emailMessage:errMsg.length>0?(errMsg[1]===undefined?"":errMsg[1].toString())
        :"invalid query params",
        passwordMessage:errMsg.length>0?(errMsg[2]===undefined?"":errMsg[2].toString())
        :"invalid query params"
    
    })
      
  }
  const user = await User.findOne({username})
  if (user) {
    return res.status(402).json( new ApiResponse("username is already taken"))
  }
  return res.status(200).json(
    new ApiResponse("username is unique")
  )
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"something went wrong"
    })
  }
}
export{
    register,login,logout,getCurrentUser,checkSignUp
}