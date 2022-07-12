const mongoose =require('mongoose')

const otpSchema = new mongoose.Schema({

    customer_Id :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    otp :{
        type:Number,
        required:true
    }, 
    expire_In :{
        type:Date,
        required:true

    },
    
},{timestamps:true})

module.exports = mongoose.model('Otp',otpSchema);