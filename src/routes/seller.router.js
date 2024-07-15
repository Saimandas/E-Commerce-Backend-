import { Router } from "express"
import { addProducts, deleteProduct, editSellersProfile, updateStock } from '../controllers/products.controller.js'
import { upload } from "../middlewares/multer.js";
import {isLoggedIn} from '../middlewares/jwt.js'
import { IsSeller } from "../middlewares/seller.js";
import { sellerAllOrder } from "../controllers/order.controller.js";

const sellerRouter= Router()


sellerRouter.route('/addProducts').post(
    
    upload.fields([{
        name:"productImg",
        maxCount:5
    }])
    ,isLoggedIn,addProducts)
sellerRouter.route('/deleteProducts').post(isLoggedIn,deleteProduct)
sellerRouter.route("/editSellerProfile").post(editSellersProfile)
sellerRouter.route("/updateStocks").post(updateStock)
sellerRouter.route("/all-orders").post(IsSeller,sellerAllOrder)
export{sellerRouter}