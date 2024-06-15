import { User } from "../modules/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import uploadFile from "../utils/cloudnary.js";
import { z } from "zod";
import {signUpSchema} from '../schema/signUpSchema.js'
import { Cart } from "../modules/cart.model.js";
import { WishList } from "../modules/wishlist.model.js";
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
    console.log(req.body);
    const user= await User.findOne({email})
    console.log(user);
    if (!user) {
      return res.status(400).json({
        message:"user doesn't exists"
       })
    }
    console.log(user);
    const isPasswordCorrect= await bcryptjs.compare(password,user.password)
    console.log(isPasswordCorrect);
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
      new ApiResponse("user logged in succesfully",savedUser)
    )

  } catch (error) {
    console.log(error);
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
    const {username,email,password}=req.body;
    const userData= {
      signUp:{username,email,password}
    }
    const result = await signUpQuery.safeParse(userData)
    
     
    if (!result.success) {
      const formattedMsg = result.error.format();
      const usernameErrors = formattedMsg.signUp?.username?._errors || ["Invalid username"];
      const emailErrors = formattedMsg.signUp?.email?._errors || ["Invalid email"];
      const passwordErrors = formattedMsg.signUp?.password?._errors || ["Invalid password"];
      
      return res.status(401).json({
        success: false,
        usernameMessage: usernameErrors[0],
        emailMessage: emailErrors[0],
        passwordMessage: passwordErrors[0]
      });
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

const addToCart= async (req,res)=>{
  try {
    const {productId,quantity}= req.body;
    const userId=req.userId;
    const cart= await new Cart({
      user:userId,
      items:[{product:productId,quantity}]
      
    });

    const savedCart= await cart.save();
    if (!savedCart) {
      return res.status(500).json({message:"product failed to added to cart"})
    }

    return res.status(200).json(
      new ApiResponse("added to cart succesfully",savedCart)
    )

  } catch (error) {
    return res.status(500).json({message:"internel server error"})
  }
}

const addToWishList= async (req,res)=>{
  try {
    const {productId}=req.body; 
    const userId= req.userId
    const isAlreadyListed= await WishList.find({user:userId, items:productId});
    if (isAlreadyListed) {
      return res.status(400).json({message:"item already is in wishlist"})
    }

    const itemAddedToWishlist= await new WishList({
      user:userId,
      items:productId
    })
    const savedItem= await itemAddedToWishlist.save();

   return res.status(200).json(
      new ApiResponse("items added to wishlist succesfully",savedItem)
    )
  } catch (error) {
    return res.status(500).json({message:"internel server error"})
  }
}
export{
    register,login,logout,getCurrentUser,checkSignUp,addToCart,addToWishList
}