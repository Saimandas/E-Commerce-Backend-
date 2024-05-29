import express, { response } from 'express'
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
    callbackURL:["http://localhost:3000/api/v1/E-Commerce/saveGoogleAuthInfo","https://campus-notes-tihucollege.onrender.com"]
},async function(accesToken,refereshToken,profile,cb){
    try {
        const user = await User.findOne({
            email:profile.emails[0].value
        })
        if (!user) {
            new User({
                
            })
        }
    } catch (error) {
        return response.status(500).json({error})
    }
    cb(null,profile)
}))

passport.serializeUser(function(user,cb){
    cb(null,user)
})
passport.deserializeUser(function(user,cb){
    cb(null,user)
})

export {passport}
import { router } from './routes/user.routes.js'
import { User } from './modules/user.model.js'
app.use("/api/v1/E-Commerce",router)
export {app}