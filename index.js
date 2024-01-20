import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './Routes/userRoute.js'


const app = express()
  

app.use(express.json({limit:'30mb',extended:true}))
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use(cors(
   { origin:["https://product-apps-ys33.vercel.app","https://product-apps-ys33-git-main-mishnans-projects.vercel.app"],
     methods:["POST","GET"],
     credentials:true
   }
))
app.use(express.static('public'))
dotenv.config()

app.use('/',userRoute)  


const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

mongoose.connect(DATABASE_URL)
.then(()=>{
    app.listen(PORT,()=>console.log('Server is Running .....'))
}).catch((err)=>{
    console.log('database not connected : ',err);
})