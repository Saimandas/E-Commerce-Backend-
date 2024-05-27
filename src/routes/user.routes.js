import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
const router= Router()

router.route("/register").post(upload.single("avatar"),register)
router.route("/login").post(login)
export {router}