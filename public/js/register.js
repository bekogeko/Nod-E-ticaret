var val = document.getElementById("password").value;
var errors = document.getElementById('errors')
function passWordLimitation(){
    switch(val){
        case val.length < 8:
            console.log('selami geldi abi')   
            errors.innerHTML = "Sifreniz 8 harften buyuk olmalı"; 
        break;
    }
}