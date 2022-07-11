const express =require('express')

const router = express.Router()
const {postLogin,postRegister,emailSend,changePassword} = require('../controller/controllers')

router.post('/login',postLogin)
router.post('/register',postRegister)
router.post('/change',changePassword)
router.post('/forget',emailSend)

module.exports= router