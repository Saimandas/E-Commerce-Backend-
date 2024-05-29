import { Product } from "../modules/Product.model"
import { Category } from "../modules/category.model"
import { User } from "../modules/user.model"
import { ApiResponse } from "../utils/ApiResponse"

const addProducts= async(req,res)=>{
    
    try {
        const {name,category,price,description,quantity,stock}=req.body
        const userId=req.user._id
        const user= await User.findById(userId)
        if (user.role==="buyer") {
            return res.status(403).json({ message: "only seller add product" });
        }

        const product= await new Product({
            name,
            price,
            description,
            quantity,
            owner:userId,
            stock
        })

        const categorySchema= await new Category({
            name:category
        })
        product.category=categorySchema._id

        const savedProduct= await product.save()
        await categorySchema.save()
        if (!savedProduct) {
            return res.status(500).json({message:"cant add product"})
        }

        return res.status(200).json(
            new ApiResponse("product added succesfully",savedProduct)
        )
    } catch (error) {
        return res.status(500).json({message:"something went wrong",error:error.message})
    }
}

const editSellersProfile= async (req,res)=>{
 try {
    
 } catch (error) {
    return res.status(500).json({message:"something went wrong",error:error.message})
 }
}

const updateStock= async (req,res)=>{
    try {
      const {product_id,stock}= req.body
      const updateProduct = await Product.findByIdAndUpdate(product_id,{
        stock
      })
      if (!updateProduct) {
        return res.status(500).json({message:"something went wrong while updating the product"})
      }
    } catch (error) {
        return res.status(500).json({message:"something went wrong",error:error.message})
    }
}
const deleteProduct= async (req,res)=>{
   try {
     const {product_id}= req.body;
     const deleteProduct= await Product.findByIdAndDelete(product_id)
     if (!deleteProduct) {
        return res.status(500).json({message:"something went wrong while deleting the product"})
     }
     return res.json(200).json(
        new ApiResponse("product deleted succesfylly")
     )
   } catch (error) {
    return res.status(500).json({message:"something went wrong",error:error.message})
   }
}