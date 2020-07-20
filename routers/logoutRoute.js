const express = require('express')
const { IsLoggedIn } = require('../middleware/Auth')
const router = express.Router()
const controller = require('../controllers/logoutCont')

router.get('/',IsLoggedIn, controller.logoutGET)






//router.get('/orders',authMW.isAdmin,controller.OrdersGET)







module.exports = router 