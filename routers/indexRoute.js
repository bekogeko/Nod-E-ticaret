const express = require('express')
const router = express.Router()
const controller = require('../controllers/indexCont')

router.get('/', controller.indexGET)

router.post('/',controller.indexPOST)







module.exports = router 