const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kategoriSchema = new Schema({
    kategoriID:{type:Number, required:true, unique:true},
    kategoriName:{type:String, required:true, unique:true},
    kategoriIcon:{type:String}
},{collection:'categories'})

let KategoriModel = mongoose.model('Category', kategoriSchema);
module.exports = KategoriModel;

