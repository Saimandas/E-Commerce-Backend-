import { Product } from "../modules/Product.model"

export async function reduceStocks(id,num=1){
    try {
       const updatedStock= await Product.findByIdAndUpdate(id,{$inc:{stock:-num},},{new:true});
       return updatedStock
    } catch (error) {
        Response.status(500).json({error:error.message})
    }
}