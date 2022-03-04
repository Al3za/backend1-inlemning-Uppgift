const mongoose=require('mongoose');
const PassLocMong=require('passport-local-mongoose');

const userSchema= new mongoose.Schema({
    username:{type:String,required:true}
    // fullName:{type:String},
    // E
});
userSchema.plugin(PassLocMong);

const USERS=mongoose.model('user',userSchema);

exports.USERS=USERS;