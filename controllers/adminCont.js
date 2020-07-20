const userModel = require('../models/userModel')
const urunModel = require('../models/urunModel')

module.exports.DashboardGET = (req,res,next)=>{    
    res.render('adminDashboard.ejs')
}

module.exports.DashboardPOST = (req,res,next)=>{}

module.exports.productsGET = (req,res,next)=>{

    res.render('adminProducts.ejs')
}

module.exports.registerReqGET = (req,res,next)=>{

    res.render('adminUsers.ejs')
}