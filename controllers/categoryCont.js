const kategoriModel = require('../models/kategoriModel')
const urunModel = require('../models/urunModel')

module.exports.getCategory = (req,res,next)=>{    

    console.log(req.params)
    kategoriModel.findOne({kategoriName:req.params.category},(err,docs)=>{
        if(err)
            throw err;
        if(docs.length ===0)
            req.redirect('/')
        
        

        urunModel.find({urunType:docs.kategoriID},(err,docs)=>{
            
            res.render("category.ejs",{products:docs})

        })


    })


    
    

}







