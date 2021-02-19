const express = require("express"); 
const app = express(); 
const mongoose=require('mongoose');
const User=require('./models/user');
let bodyParser=require('body-parser');
let jasonParser=bodyParser.json();
const bcrypt = require ('bcrypt');
const crypto=require('crypto');
var key="password";
var algo='aes256';
const saltRounds = 10;
const jwt=require('jsonwebtoken');
const jwtKey="jwt"
//connecting to atlas/DB
mongoose.connect('mongodb+srv://raman111:Raman@111@cluster0.2errd.mongodb.net/authentication?retryWrites=true&w=majority',
{
  useNewUrlParser:true,
  useUnifiedTopology:true
}
).then(()=>{console.warn("db dbdbdbdbdb");})


// Root route of express app 
app.get("/", (req, res) => { 
  res.send("Hell0000000000000o Geeks"); 
}); 

//post requests
app.post('/resister',jasonParser, function(req,res){

  let data= new User({
    _id:mongoose.Types.ObjectId(),
    name:req.body.name,
    email:req.body.email,
    address:req.body.address,
    password:req.body.password,
  })

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(err) throw err;

    data.password=hash;
    data.save().then((result)=>{
      jwt.sign({result},jwtKey,{expiresIn: '300000s'},(err,token)=>{
        res.json({token})
      })
    });
  });

 
 //res.end("hellowwwwww my boyssssss");
})
  


app.post('/login',jasonParser,function(req,res){
  User.findOne({email:req.body.email}).then((data)=>{
    console.warn(data);
    var password2 = req.body.password;
    bcrypt.compare(password2, data.password, function(err, result) {
    if (result) {
      console.warn("matches bruhhh")
      jwt.sign({data},jwtKey,{expiresIn: '300000s'},(err,token)=>{
        res.json({token})
      })
    }
    else {
      console.warn("Invalid password!");
    }
});
  })

  //res.end("done");
})

app.get('/users',verifyToken,function(req,res){
  User.find().then((result)=>{
    res.json(result)
  })
})

function verifyToken(req,res,next){
  const bearerHeader=req.headers['authorization'];
 
  
  if(typeof bearerHeader !=='undefined')
  {
    const bearer=bearerHeader.split(' ')
    console.warn(bearer[1]);
    req.token=bearer[1]
    jwt.verify(req.token,jwtKey,(err,authData)=>{
      if(err)
      res.json({result:err})
      else
      next();
    })

  }
  else
  {
    res.send({"result":"token not given"})
  }
}

// Server setup 
app.listen(3000); 