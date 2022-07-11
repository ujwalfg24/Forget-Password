const express =require('express')
const app =express()
const mongoose =require('mongoose')
const bodyParser=require('body-parser')
const userRouter =require('./routes/route')
require=require('dotenv').config()

const PORT = process.env.PORT||3000;



app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended:true}))

app.use(express.urlencoded({ extended:false}))
app.use('/user',userRouter)


app.listen(PORT ,()=>console.log(`server started at ${PORT}`))

mongoose.connect("mongodb://localhost:27017/password",{useNewUrlParser:true})
const db = mongoose.connection;
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log(`connected to database`));

