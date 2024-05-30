import { Router } from "express"
import { addProducts, deleteProduct } from '../controllers/products.controller.js'
import { upload } from "../middlewares/multer.js";
import {isLoggedIn} from '../middlewares/jwt.js'


const sellerRouter= Router()


sellerRouter.route('/addProducts').post(
    
    upload.fields([{
        name:"productImg",
        maxCount:5
    }])
    ,isLoggedIn,addProducts)
sellerRouter.route('/deleteProducts').delete(isLoggedIn,deleteProduct)

export{sellerRouter}