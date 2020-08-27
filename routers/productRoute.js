const express = require('express')
const { IsLoggedIn,IsAdmin } = require('../middleware/Auth')
const router = express.Router()
const controller = require('../controllers/productCont')



router.get('/:productName',IsLoggedIn,controller.getProduct)










module.exports = router 