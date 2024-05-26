import { connectDB } from './db/index.js'
import {app} from './app.js'
import dotnev from 'dotenv'
dotnev.config({
    path:"./.env"
})
connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is litening at port:${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(err);
    process.exit(0)
})