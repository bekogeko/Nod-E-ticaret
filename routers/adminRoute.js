const express = require('express')
const { IsAdmin } = require('../middleware/Auth')
const router = express.Router()
const controller = require('../controllers/adminCont')

router.get('/dashboard',IsAdmin, controller.DashboardGET)
router.post('/dashboard',IsAdmin,controller.DashboardPOST)

router.get('/products',IsAdmin,controller.productsGET)
router.get('/registerReq',IsAdmin,controller.registerReqGET)

router.get('/categories',IsAdmin,controller.categoriesGET)









module.exports = router 