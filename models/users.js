const mongoose=require('mongoose');
const PassLocMong=require('passport-local-mongoose');

const userSchema= new mongoose.Schema({
    textLocation: {type:mongoose.Schema.Types.ObjectId,ref:'Posts'},
    username:{type:String,required:true},
    email:{type:String, default:""},
    fullname:{type:String,default:""},
    picture:{type:String,default:"https://i.stack.imgur.com/34AD2.jpg"}
});
userSchema.plugin(PassLocMong);

const USERS=mongoose.model('user',userSchema);

exports.USERS=USERS;