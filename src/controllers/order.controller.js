import { Product } from "../modules/Product.model.js";
import { Order } from "../modules/oreder.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getFinalValue, isCuponCodeValid } from "../utils/isCuponCodeValid.js";
import { increaseStock, reduceStocks } from "../utils/stocks.js";

const makeOrder= async(req,res)=>{
    try {
        const {productId,quantity,orderPrice,address,pinCode,city,country,state,cuponCode}=req.body;
        let finalPrice;
       const isValid =await isCuponCodeValid(cuponCode);
       console.log(isValid);
       if (isValid) {
       finalPrice=await getFinalValue(orderPrice,cuponCode);
       console.log(finalPrice);
       }else{
       finalPrice=orderPrice
       } 
      const product= await Product.findByIdAndUpdate(productId,{$inc:{avilableStock:-quantity}});
      if (!product) {
        return res.status(404).json({message:"Product doesn't exits"});
      }
        const newOrder= await new Order({
            customer:req.userId,
            orderItem:
                [
                    {
                        product:product._id,
                        quantity
                    }
                ],
            Price:orderPrice,
            finalPrice,
            shippingInfo:{
                pinCode,
                city,
                country, 
                address,
                state
            }
        });
        
    if (!newOrder) {
        return res.status(500).json({succes:false,message:"something went wrong while making order"});
    }

    const savedOrder= await newOrder.save();
    return res.status(200).json( new ApiResponse("order created succesfully",savedOrder));
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}

const cancelOrder= async function(req,res){
    try {
        const {orderId}= req.body;
        // const deletedOrder= await Order.findByIdAndDelete(orderId);
        // if (!deletedOrder) {
        //     return res.status(500).json({succes:false,message:"something went wrong while deleted order"});
        // }
        
        const cancelOrder= await Order.findByIdAndUpdate(orderId,{status:"CANCELLED"})
        //console.log(cancelOrder);
        if (!cancelOrder) {
            return res.status(404).json({message:"Invalid Order"})
        }
        let product_id=[]
        let isIncrease;
        for (let i = 0; i < cancelOrder.orderItem.length; i++) {
             product_id.push(cancelOrder.orderItem);
        }
       // console.log(product_id);
        product_id.map((e)=>{
            isIncrease= increaseStock(e[0].product,e[0].quantity)
        })
        if (!isIncrease){
            return res.status(500).json({
                message:"Something went wrong while reducing the stocks"
            });
        }    
        
    
        return res.status(200).json(
           new ApiResponse("Order Cancelled Succesfully",cancelOrder)
        );
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}

export {makeOrder,cancelOrder}