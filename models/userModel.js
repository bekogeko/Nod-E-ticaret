const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
  fullname:{type:String, required:true},
  email: { type:String ,required: true, unique:true,lowercase: true },
  password: { type:String, required: true },
  isAdmin: {type:Boolean,required:true,default:false},
  permission: { type:Object,default:null },
  isVerified:{type: Boolean, default: false}
  
});

let UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;








