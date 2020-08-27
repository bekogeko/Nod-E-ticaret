var val = document.getElementById("password").value;
var errors = document.getElementById('errors')
function passwordLimitation(){
    switch(val){
        case val.length < 8:
            console.log('selami geldi abi')   
            errors.innerHTML = "Sifreniz 8 harften buyuk olmalı"; 
        break;
    }
}
function showPassword(passid){
    var password = document.getElementById(passid);
    
    currentType = password.type

    if(currentType == "password"){
        
        password.type = "text";
        
    }else if (currentType == "text"){
        
        password.type = "password";
        
    }
    
}