import { Coupon } from "../modules/cupon.model.js";

export async function isCuponCodeValid(cuponCode){
        const cupon= await Coupon.findOne({code:cuponCode});
        if (!cupon) {
            return false;
        }
        return true       
}

export async function getFinalValue(orderAmount,cuponCode){
    try {
       const cupon= await Coupon.findOne({code:cuponCode})
       console.log(cupon);
       if (orderAmount>=cupon.minAmount) {
        const discountPrice=cupon.amount;
        const finalPrice= orderAmount-discountPrice;
        return finalPrice;
       }else{
        return false
       }
      

    } catch (error) {
        return error.message
    }
}

