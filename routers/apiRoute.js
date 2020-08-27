const express = require('express')
const router = express.Router()
const controller = require('../controllers/apiCont')
const { IsAdmin } = require('../middleware/Auth')


router.get('/categories',IsAdmin, controller.categoriesGET)

router.get('/requsers',IsAdmin, controller.requsersGET)

router.delete('/deluser',IsAdmin, controller.deluserDELETE)

router.put('/verifyuser',IsAdmin, controller.verifyuserPUT)
router.put('/edituser',IsAdmin,controller.editusersPUT)



router.get('/products',IsAdmin, controller.productsGET)
router.post('/products',IsAdmin, controller.productsPOST)
router.delete('/products',IsAdmin, controller.productsDELETE)




module.exports = router 