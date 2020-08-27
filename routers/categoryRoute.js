const express = require('express')
const { IsLoggedIn,IsAdmin } = require('../middleware/Auth')
const router = express.Router()
const controller = require('../controllers/categoryCont')



router.get('/:category',IsLoggedIn,controller.getCategory)










module.exports = router 