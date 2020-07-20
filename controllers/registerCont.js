const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')


module.exports.indexGET = (req,res,next)=>{
    res.render('register.ejs',{
        user: null,
        hata: req.query.hata,
        succes: req.query.succes
    })
}

module.exports.indexPOST = async (req,res,next)=>{

    try {
        
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        
        var newUser = new userModel({
            fullname: req.body.name,
            email: req.body.email,
            password: hashedPassword,  
        })
        newUser.save((err)=>{
            if(err){
                throw err
            }
        })
        res.redirect('/login')

    } catch  {
        res.redirect('/register')
    }
}







//Burası ga


/*
    if (req.body.password === req.body.passwordRepeat){
        if (req.body.password )

        
        var newUser = new userModel({
            fullname: req.body.name,
            email: req.body.email,
            password: req.body.password,  
        })
        newUser.save((err) => {
            if(err){
                switch(err.code){
                    case 11000:
                        res.redirect('./register?hata=2')
                        break


                        
                    default:
                        res.send('Allah var, hata da var: ' + err + "<br> kodu da: " + err.code)
                            break
                }

            }
            else
                res.redirect('./register?succes=true')
        })
    } else {
        res.redirect('./register?hata=1')
    }
    */