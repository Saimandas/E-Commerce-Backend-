import { User } from "../modules/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import uploadFile from "../utils/cloudnary.js";
const register= async (req,res)=>{
    try {
      const {username,email,password}=req.body;
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
        email,username,password:hashedPassword,avatar:avatarUrl
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
    user.refreshToken=refereshToken
    const option={
      httpOnly:true,
      secure:false
    }
    return res.status(200)
    .cookie("accesToken",accesToken,option)
    .cookie("refreshToken",refereshToken,option)
    .json(
      new ApiResponse("user logged in succesfully")
    )

  } catch (error) {
    console.log(error);
    throw new ApiError(500,error)
  }
}


export{
    register,login
}