import { Product } from "../modules/Product.model.js"
import { Category } from "../modules/category.model.js"
import { User } from "../modules/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import uploadFile from "../utils/cloudnary.js"

const addProducts= async(req,res)=>{
    
    try {
        const {name,category,price,description,stock}=req.body
        const userId=req.userId
        const user= await User.findById(userId)
        if (user.role==="buyer") {
            return res.status(403).json({ message: "only seller can add product" });
        }
        const filesLenght= req.files.productImg.length
        let files=[];
        for (let i = 0; i<filesLenght; i++) {
            files[i]=req.files.productImg[i].path
            console.log(files);
            
        }
       
        const productImg=[]
        for(let i=0;i<filesLenght;i++){
            productImg[i]= await uploadFile(files[i]);
            
        }
        const product= await new Product({
            name,
            price,
            description,
            owner:userId,
            stock,
            avilableStock:stock,
            productImg:productImg.map((e)=>{
                return e
            })
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
    const {_id,storeAddress,storeName,contactInfo}= req.body
    const user= await User.findById(_id);
    if (!user.role==="seller") {
        return res.status(500).json({message:"seller doesn't exist"});
    }
    const updateUser= await User.findByIdAndUpdate(user._id,{
        storeAddress,
        storeName,
        contactInfo
    }).select("-password -refreshToken")
    const savedUser= await updateUser.save({validateBeforeSave:false})
    if (!savedUser) {
        return res.status(500).json({message:"user updation failed"});
    }
    return res.status(200).json(
        new ApiResponse("user updated succesfully",savedUser)
    )

 } catch (error) {
    console.log(error);
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
      return res.status(200).json(
        new ApiResponse("stocks updated",updateProduct)
      )
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

export {
    addProducts,editSellersProfile,updateStock,deleteProduct
}