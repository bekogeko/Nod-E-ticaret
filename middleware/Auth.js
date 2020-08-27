const PERMISSIONS = {

}


function IsAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.isAdmin){
        next()
    }else{
        res.redirect('/')
    }
}
function IsNotAdmin(req,res,next){
    if(!req.isAuthenticated() && !req.user.isAdmin){
        res.redirect('/')
    }else{
        next();
    }
}

function IsLoggedIn(req,res,next){
    if(req.isAuthenticated() && req.user !==undefined){
        next()
    }else{
        console.log(req.isAuthenticated())
        console.log(req.user)
        console.log(req.isAuthenticated() && req.user !==undefined)
        res.redirect('/')
    }
}
function IsNotLoggedIn(req,res,next){
    if(!req.isAuthenticated() && req.user === undefined){
        res.redirect('/');
    }else{
        next();
    }
}
module.exports={
    PERMISSIONS,
    IsAdmin,
    IsNotAdmin,
    IsLoggedIn,
    IsNotLoggedIn
}


