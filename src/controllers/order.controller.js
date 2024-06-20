import { Product } from "../modules/Product.model";
import { Order } from "../modules/oreder.model";
import { ApiResponse } from "../utils/ApiResponse";
import { getFinalValue } from "../utils/isCuponCodeValid";
import { reduceStocks } from "../utils/stocks";

const makeOrder= async(req,res)=>{
    try {
        const {productId,quantity,orderPrice,address,pinCode,city,country,state,cuponCode}=req.body;
        const finalPrice= await getFinalValue(orderPrice,cuponCode);
        await Product.findByIdAndUpdate(productId,{$inc:{stock:-quantity}});
        const newOrder= await new Order({
            customer:req.userId,
            orderItem:
                [
                    {
                        productId,
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
    return res.status.json(ApiResponse("order created succesfully",savedOrder));
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
        let product_id=[]
        let stocks=[]
        for (let i = 0; i < cancelOrder.type.length; i++) {
             product_id.push(cancelOrder.type[i].productId);
            stocks.push(reduceStocks(product_id(i)));
            
        }
        if (!stocks.length>0) {
            return res.status(500).json({
                message:"Something went wrong while reducing the stocks"
            });
        }    
        
    
        return res.status(200).json(
            ApiResponse("Order Cancelled Succesfully",cancelOrder)
        );
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}

export {makeOrder,cancelOrder}