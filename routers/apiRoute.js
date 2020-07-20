const express = require('express')
const router = express.Router()
const controller = require('../controllers/apiCont')
const { IsAdmin } = require('../middleware/Auth')

router.get('/products',IsAdmin, controller.productsGET)
router.get('/addproducts',IsAdmin, controller.productsAddGET)

router.get('/requsers',IsAdmin, controller.requsersGET)
router.get('/delusers',IsAdmin, controller.delusersGET)
router.get('/updateusers',IsAdmin, controller.updateusersGET)

router.post('/edituser',IsAdmin,controller.editusersPOST)







module.exports = router 