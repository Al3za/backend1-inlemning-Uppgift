const express = require("express");
const multer=require('multer');
const path=require('path');
const app = express()
const PORT = 3000;

app.use(express.urlencoded({extended:true}));
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/SignIn');
const {USERS}=require('./models/users.js');
const {POSTS}=require('./models/Post.js')
const passport=require('passport');
const session=require('express-session');
const { errors } = require("passport-local-mongoose");
const e = require("express");
const { type } = require("os");

app.use(express.static('./public'))

passport.use(USERS.createStrategy());



const storage=multer.diskStorage({
  destination:"./public/uploads", 
  filename: function(req,file,cb){ 
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload=multer({storage:storage}); 
app.use(session({
  secret:'2228983928',
  resave:false,
  saveUninitialized:false
}))

app.use(passport.authenticate('session'));

passport.serializeUser(USERS.serializeUser());
passport.deserializeUser(USERS.deserializeUser());

app.get('/',(req,res)=>{
  if(req.user){
    res.render('inloggad.ejs',{User:req.user})
  }else{
    res.redirect('/login')
  }
})

app.get('/changeProfile/:Userid',(req,res)=>{
  res.render('UserProfil.ejs')
})  

app.post('/changeProfile/:Userid',upload.single('image'), async (req,res)=>{
  
  const idUser=req.params.Userid;
  const {email,fullname}=req.body;
  const profile= await USERS.updateOne({_id:`${idUser}`},{email:`${email}`,fullname:`${fullname}`,picture:`/uploads/${req.file.filename}`});

  res.redirect('/')
}) 

app.get('/chooseUser',async(req,res)=>{
  const chooseUser= await USERS.find({});
  res.render('chooseUser.ejs',{choose:chooseUser})
})  

app.post('/userChoose',(req,res)=>{
  const user=req.body.userOpt;
  res.redirect('chooseUser');  
}) 
  
app.get('/SeeAllBlogs',async (req,res)=>{

  const posted= await POSTS.find({});

 const join= await USERS.aggregate([{$lookup:{from: 'posts',
 localField: 'textLocation',
 foreignField: '_id',
 as:'spot'}}]); 
     
 res.render('seeAllBlogs.ejs',{AllBlogs:join})
})
 

app.get('/blog/:blogID',(req,res)=>{
  res.render('blog.ejs') 
})  

 app.post('/blog/:blogID',async (req,res)=>{

 const blog=req.body.blogs;            
 const userID=req.params.blogID; 

 const posts= await new POSTS({Posts:blog,Datum:new Date()});
 await posts.save();

   const UsersJoin= await USERS.findOne({_id:userID});
   UsersJoin.textLocation.splice(0,0,posts.id);
   await UsersJoin.save();

 res.redirect(`/blog/${userID}`)   
   });    
        
   app.get('/SeeBlogs/:seePosts',async(req,res)=>{

    const seePosts=req.params.seePosts;

    const Userid=await USERS 
    .findOne({_id:seePosts})
    .populate('textLocation'); 
    res.render('seePosts.ejs',{user:Userid}) 
   });
  
app.get('/login',(req,res)=>{  
  res.render('login.ejs') 
}); 

app.get('/loggaUT',(req,res)=>{  
  res.redirect('/login')
});
 
app.post('/login',passport.authenticate('local',{
  successRedirect:'/'
})) 

app.get('/signin',(req,res)=>{
  res.render('signin.ejs')
});

app.post('/signin',async (req,res)=>{
  const {username,password}=req.body;
  const user=new USERS({username});
  await user.setPassword(password);
  await user.save();
  res.redirect('/login')
})


app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});

