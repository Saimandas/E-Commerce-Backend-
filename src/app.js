import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import { Strategy  } from 'passport-google-oauth20'
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
passport.use(new Strategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:3000/api/v1/E-Commerce/Google"
},function(accesToken,refereshToken,profile,cb){
    cb(null,profile)
}))

passport.serializeUser(function(user,cb){
    cb(null,user)
})
passport.deserializeUser(function(user,cb){
    cb(null,user)
})

import { router } from './routes/user.routes.js'
app.use("/api/v1/E-Commerce",router)
export {app}