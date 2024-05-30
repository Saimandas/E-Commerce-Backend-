import { Router } from "express";
import { checkSignUp, getCurrentUser, login, logout, register } from "../controllers/user.controller.js";
import { addProducts, deleteProduct } from '../controllers/products.controller.js'
import { upload } from "../middlewares/multer.js";
import {isLoggedIn} from '../middlewares/jwt.js'
import {passport} from '../app.js'
const router= Router()

router.route("/register").post(upload.single("avatar"),register)
router.route("/login").post(login)
router.route("/logout").get(isLoggedIn,logout)
router.route("/getCurrentUser").get(isLoggedIn,getCurrentUser)
router.route("/checkSignUp").get(checkSignUp)
router.route("/authGoogle").get(passport.authenticate("google",{scope:["profile","email"]}));
router.route("/abc").get(passport.authenticate("google",{scope:["profile","email"]}),(req,res)=>{
    req.logOut(); // Logout from Google
    console.log("Logout initiated");
    res.send("Logout initiated");
})
router.route('/googleCallback').get(passport.authenticate("google",{failureRedirect:"/login"}),(req,res)=>{
    if (req.isAuthenticated) {
        res.redirect("https://www.google.com/")
    }else{
        res.send("helo")
    }
})
export {router}