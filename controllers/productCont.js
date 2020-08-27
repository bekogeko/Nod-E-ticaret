const kategoriModel = require('../models/kategoriModel')
const urunModel = require('../models/urunModel')

module.exports.getProduct = (req,res,next)=>{    


    urunModel.findOne({urunName:req.params.productName},(err,docs)=>{

        if(err)
            throw err
        res.render("product.ejs",{product:docs,user:req.user})
    })
    
    

}







