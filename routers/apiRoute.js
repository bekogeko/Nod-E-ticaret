const express = require('express')
const router = express.Router()
const controller = require('../controllers/apiCont')
const { IsAdmin } = require('../middleware/Auth')

router.get('/products',IsAdmin, controller.productsGET)
router.get('/addproducts',IsAdmin, controller.productsAddGET)

router.get('/requsers',IsAdmin, controller.requsersGET)

router.delete('/deluser',IsAdmin, controller.deluserDELETE)

router.put('/verifyuser',IsAdmin, controller.verifyuserPUT)
router.put('/edituser',IsAdmin,controller.editusersPUT)







module.exports = router 