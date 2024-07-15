import jwt from 'jsonwebtoken'
import { User } from '../modules/user.model.js';
export async function IsSeller(req,res,next){
    try {
        const accesToken= req.cookies?.accesToken;
        if (!accesToken) {
          return  res.status(400).json({message:"please login to procced"})
        }
        const {_id}= await jwt.verify(accesToken,process.env.ACCES_TOKEN_SECERT);
        if (!_id) {
            return  res.status(400).json({message:"Invalid token"});
        }
        const user=await User.findById(_id);
        const IsSeller=user.isAdmin;
        if (!IsSeller) {
            return  res.status(400).json({message:"Only seller can acces this page"})
        }
        req.seller=user._id;
        next()
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}