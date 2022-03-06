const express = require("express");
const multer=require('multer');
const path=require('path');
const app = express()
const PORT = 3000;

app.use(express.urlencoded({extended:true}));
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/SignIn');
const {USERS}=require('./models/users.js');
const passport=require('passport');
const session=require('express-session');
const { errors } = require("passport-local-mongoose");

app.use(express.static('./public'))

passport.use(USERS.createStrategy());

const storage=multer.diskStorage({
  destination:'./public/uploads',
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
    res.render('inloggad.ejs',{username:req.user.username})
  }else{
    res.redirect('/login')
  }
})

app.post('/upload',upload.single('image'),(req,res,next)=>{
    const {email,fullname}=req.body;
   const {file:filename}=req.file; 

  res.render('userProfil.ejs',{
    infoName:req.body.fullname,
    infoMail:req.body.email,
    photo:`uploads/${req.file.filename}`
  })
  })

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
