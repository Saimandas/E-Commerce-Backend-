import { Router } from "express";
import { checkSignUp, checkUsername, getCurrentUser, login, logout, register } from "../controllers/user.controller.js";
import { addProducts, deleteProduct, filter, getAllProducts, getProductsByCategory, serachProducts } from '../controllers/products.controller.js'
import { upload } from "../middlewares/multer.js";
import {isLoggedIn} from '../middlewares/jwt.js'
import { makeOrder,cancelOrder, getAllOrder, getSingleOrder } from "../controllers/order.controller.js";
//import {passport} from '../app.js'
const router= Router()

router.route("/register").post(upload.single("avatar"),register)
router.route("/login").post(login)
router.route("/logout").get(isLoggedIn,logout)
router.route("/getCurrentUser").get(isLoggedIn,getCurrentUser)
router.route("/checkSignUp").get(checkSignUp)
router.route("/make-order").post(makeOrder)
router.route("/cancel-order").post(cancelOrder)
router.route("/products").get(getAllProducts)
router.route("/category").get(getProductsByCategory)
router.route("/search").get(serachProducts)
router.route("/filter").get(filter)
router.route("/all-orders").get(getAllOrder)
router.route("/order").get(getSingleOrder)
router.route("/check-username").get(checkUsername)
// router.route("/authGoogle").get(passport.authenticate("google",{scope:["profile","email"]}));
// router.route("/abc").get(passport.authenticate("google",{scope:["profile","email"]}),(req,res)=>{
//     req.logOut(); // Logout from Google
//     console.log("Logout initiated");
//     res.send("Logout initiated");
// })
// router.route('/googleCallback').get(passport.authenticate("google",{failureRedirect:"/login"}),(req,res)=>{
//     if (req.isAuthenticated) {
//         res.redirect("https://www.google.com/")
//     }else{
//         res.send("helo")
//     }
// })
export {router}