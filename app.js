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

app.use(express.static('./public'))

passport.use(USERS.createStrategy());



const storage=multer.diskStorage({
  destination:path.join(__dirname,'public','uploads'),
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
    //console.log(new Date())
    res.redirect('/login')
  }
})

app.get('/changeProfile/:Userid',(req,res)=>{
  res.render('UserProfil.ejs')
})  

app.post('/changeProfile/:Userid',upload.single('image'), async (req,res)=>{
  const idUser=req.params.Userid;
  const {email,fullname}=req.body;
  const profile= await USERS.updateOne({_id:`${idUser}`},{email:`${email}`,fullname:`${fullname}`,picture:`uploads/${req.file.filename}`});
  res.redirect('/')
}) 


// app.post('/blog',async (req,res)=>{
//   const blog=req.body.blogs;

//   const posts= await new POSTS({Posts:blog,Datum:new Date()});
//   await posts.save();

//   res.redirect('/');
//     }); 

app.get('/blog/:blogID',(req,res)=>{
  res.render('blog.ejs') 
})  

const arr=[]; 

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
    console.log(Userid);
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

//dag 3 m716F#Ux
 //dag 5 49GB1!CS

 //dag 6 2Kp=EF!G

 //ROL@Z7.4
 
 //?3HYpk3%