import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app= express()

app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import { router } from './routes/user.routes.js'
app.use("/api/v1/E-Commerce",router)
export {app}