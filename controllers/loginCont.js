const passport = require('passport')

module.exports.indexGET = (req,res,next)=>{
    res.render('login.ejs',{user:req.user})
}

module.exports.indexPOST = (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)
}