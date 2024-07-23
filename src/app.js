import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// import passport from 'passport'
// import session from 'express-session'
// import { Strategy  } from 'passport-google-oauth20'
// import { User } from './modules/user.model.js'
const app= express()


app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
// app.use(session({
//     secret: process.env.PASSWORD_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie:{secure:false}
//   }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new Strategy({
//     clientID:process.env.CLIENT_ID,
//     clientSecret:process.env.CLIENT_SECRET,
//     callbackURL:"http://localhost:3000/api/v1/E-Commerce/users/googleCallback"
// },async function(accesToken,refereshToken,profile,cb){
//     try {
//         let user = await User.findOne({ email: profile.emails[0].value, role: "buyer" });
//         console.log(user);
//         if (!user) {
//            const newUser= new User({
//                 email:profile.emails[0].value,
//                 username:profile.displayName,
//                 avatar:profile.photos[0].value,
//                 role:"buyer",
//             })
//             const savedUser= newUser.save({validateBeforeSave:false})
//             console.log(savedUser);
//            return cb(null,savedUser)
//         }
//         cb(null,user)
//       //  return cb(new Error("Username already exists"))
//     } catch (error) {
//         cb(error)
//     }
// }))

// passport.serializeUser(function(user,cb){
//     cb(null,user)
// })
// passport.deserializeUser(function(user,cb){
//     cb(null,user)
// })

//export {passport}
import { router } from './routes/user.routes.js'
app.use("/api/v1/E-Commerce/users",router)
import {sellerRouter} from './routes/seller.router.js'
app.use("/api/v1/E-Commerce/seller",sellerRouter)
export {app}
