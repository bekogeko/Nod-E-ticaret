module.exports.logoutGET=(req,res,next)=>{
    req.logout();
    res.redirect('/')
}