import Jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/ApiResponse.js';

export async function isLoggedIn(req,res,next){
    try {
        const token= req.cookies?.accesToken;
        if (!token) {
            return res.status(402).json(
                new ApiResponse("please login to procced")
            )
        }
        const userId= await Jwt.verify(token,process.env.ACCES_TOKEN_SECERT)
        if (!userId) {
            return res.status(400).json(
                new ApiResponse("invalid token")
            )
        }

        req.userId=userId._id
        next()

    } catch (error) {
        return res.status(500).json({
            message:"internal server error"
        })
    }
}