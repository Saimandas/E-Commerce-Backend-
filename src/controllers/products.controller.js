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
        await categorySchema.save()  
        product.category=categorySchema._id;
        product.categoryName=categorySchema.name;
        const savedProduct= await product.save()  
    //     const categoryOf= await Product.aggregate([{
    //         $lookup:{
    //           from:"categories",
    //           localField:"category" ,
    //           foreignField:"_id",
    //           as: "categories_Field"
    //         }},{
    //         $addFields: {
    //           categoryOf:{$arrayElemAt:["$categories_Field.name",0]}
    //         }
    //       }])
    //    console.log("abc",categoryOf);

      
       // console.log(savedProduct);
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

const getAllProducts= async (req,res)=>{
             try {
               const data= await Product.find();
               console.log(data);
               return res.status(200).json(
                new ApiResponse("product deleted succesfylly",data)
             )
             } catch (error) {
                return res.status(500).json({message:"something went wrong",error:error.message}) 
             }
}
const getProductsByCategory=async (req,res)=>{
    try {
      const {category_id}=req.body;
      const products= await Product.find({category:category_id});
      if (!products) {
        return res.status(500).json({succes:false,message:"something went wrong while getting the products"})
      }
      return res.status(200).json(
        new ApiResponse("product deleted succesfylly",products)
     )
    } catch (error) {
        return res.status(500).json({message:"something went wrong",error:error.message}) 
    }
}
const serachProducts= async (req,res)=>{
    try {
        const name= req.params.name;
        
          

        
        await Product.createIndexes({name:"text",categoryName:"text"});
       
        const products= await Product.find({
            $text:{
                $search:name
            }
        })
        if (!products.length>0) {
            return res.status(404).json({succes:false,message:"products doesn't exists"}); 
        }
     
        return res.status(200).json(
            new ApiResponse("product founded Succesfully",products)
         )
    } catch (error) {
        return res.status(500).json({message:"something went wrong",error:error.message}) 
    }
}
export {
    addProducts,editSellersProfile,updateStock,deleteProduct,getAllProducts,getProductsByCategory,serachProducts
}