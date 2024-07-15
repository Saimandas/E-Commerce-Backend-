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

const getAllOrder= async (req,res)=>{

   try {
     const {userId}=req.body;

     const order= await Order.find({customer:userId});
     if (!order) {
        return res.status(402).json({
            message:"Cant find the order"
        });
     }
     return res.status(200).json(
        new ApiResponse("Order get succesfully",order)
     );
   } catch (error) {
    return res.status(500).json({message:"Internal server error",error:error.message})
   }

}

const getSingleOrder= async(req,res)=>{
    try {
        const {orderId}= req.body;
        const order= await Order.findById(orderId);
        if (!order) {
            return res.status(402).json({
                message:"Cant find the order"
            });
         }

         return res.status(200).json(
            new ApiResponse("Order found Succesfully",cancelOrder)
         );
        
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}

const sellerAllOrder=async (req,res)=>{
    try {
        const {seller_id}= req.body;
        const product= await Product.find({owner:seller_id});
        if (!product) {
            return res.status(402).json({
                succes:false,message:"No products add from this seller"
            })
        }
        console.log(product[0]._id);
        const orders=await Order.find({orderItem:product[0]._id});
        console.log(orders);
        if (!orders) {
            return res.status(402).json({
                succes:false,message:"No order Placed"
            })
        }
        console.log(orders
            );
        return res.status(200).json(
           new ApiResponse("Order found Succesfully",orders)
        );
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}
const proccesOrder= async (req,res)=>{
    try {
        const {orderId,state}=req.body;
        const seller_id= req.seller;
        const order= await Order.findById(orderId);
        const product=order.type[0]?.product;
        const orderSellerInfo=product.owner;
        if (seller_id!=orderSellerInfo) {
            return res.status(402).json({
                message:"Only Products seller can procces orders"
            });   
        }
        if (!order) {
            return res.status(404).json({
                message:"Cant find the order"
            });
        }
        order.status=String(state);
        return res.status(200).json(
            new ApiResponse(`order ${state} succesfully`)
         );
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error:error.message})
    }
}
export {makeOrder,cancelOrder,getAllOrder,getSingleOrder,proccesOrder,sellerAllOrder}
