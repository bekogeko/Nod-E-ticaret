module.exports.indexGET = (req,res,next)=>{
    
    

    if(req.isAuthenticated() && req.user.isAdmin){
        
        res.render('index.ejs',{user:req.user,isAdmin:true})

    }else {
     
        res.render('index.ejs',{user:req.user,isAdmin:false})   
    }
    
}

module.exports.indexPOST = (req,res,next)=>{

}
