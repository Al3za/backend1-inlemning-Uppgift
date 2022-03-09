const mongoose=require('mongoose');

const PostsSchema=new mongoose.Schema({
    Posts:{type:String},
    Datum:{type:String}
});

const POSTS=mongoose.model('Posts',PostsSchema);

exports.POSTS=POSTS;