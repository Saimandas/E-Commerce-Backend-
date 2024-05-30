import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import { Strategy  } from 'passport-google-oauth20'
import { User } from './modules/user.model.js'
const app= express()


app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(session({
    secret: process.env.PASSWORD_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false}
  }));

app.use(passport.initialize());
app.use(passport.session());


export {passport}
import { router } from './routes/user.routes.js'
app.use("/api/v1/E-Commerce/users",router)
import {sellerRouter} from './routes/seller.router.js'
app.use("/api/v1/E-Commerce/seller",sellerRouter)
export {app}