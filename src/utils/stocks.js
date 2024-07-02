import { Product } from "../modules/Product.model.js"

export async function reduceStocks(id,num=1){
    try {
       const updatedStock= await Product.findByIdAndUpdate(id,{$inc:{avilableStock:-num},},{new:true});
       return updatedStock
    } catch (error) {
        Response.status(500).json({error:error.message})
    }
}

export async function increaseStock(product_id,quantity){
try {
    console.log(product_id,quantity);
   const product= await Product.findByIdAndUpdate(product_id,{$inc:{avilableStock:quantity}},{new:true})
   if (product) {
    return true
   }
   return false
} catch (error) {
    console.log("abc",error.message);
    return false
}
}