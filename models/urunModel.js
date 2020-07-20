const mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var urunSchema = new Schema({
    urunType:{type: Number, required:true},
    urunName:{type: String,required: true,unique: true},

    urunPhotos:{type: [{colorHEX:String,coloredProductPath:String,colorName:String}] ,required:true   }
   // urunColors:{type: [{colorName:String,colorPath:String,colorHEX:String}],required:true}
})

let UrunModel = mongoose.model('product',urunSchema);
module.exports = UrunModel;







/*
sehpa
Sehpa 
Sehpa
sehp
Sehp
*/


/*



/** 
* Paste one or more documents here
*/






















