const express = require("express"); 
const app = express(); 
const mongoose=require('mongoose');
const User=require('./models/user');
let bodyParser=require('body-parser');
app.use(express.urlencoded({ extended: true }));
let jasonParser=bodyParser.json();
const bcrypt = require ('bcrypt');
const jwt=require('jsonwebtoken');
const saltRounds=10;
let vartoken;

const dotenv=require('dotenv');
dotenv.config({path: './config.env'});


app.set('view engine', 'ejs');
app.set('views', 'views');

//connecting to atlas/DB
mongoose.connect('mongodb+srv://'+process.env.dbUser+':'+process.env.dbPassword+'@cluster0.2errd.mongodb.net/authentication?retryWrites=true&w=majority',
{
  useNewUrlParser:true,
  useUnifiedTopology:true
}
).then(()=>{console.warn("db dbdbdbdbdb");})


// Root route of express app 
app.get("/", (req, res) => { 
 
  res.render('allcansee');
}); 

//RESISTER
app.get('/register', (req,res)=>{
  res.render('resister');
})

app.post('/register', jasonParser, function(req,res){

  let data= new User({
    _id:mongoose.Types.ObjectId(),
    name:req.body.name,
    email:req.body.email,
    address:req.body.address,
    password:req.body.password,
  })

  User.findOne({email:req.body.email}).then((data)=>{
    if(data)
      res.end('this email already exist');

  })

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(err) throw err;

    data.password=hash;
    data.save().then((result)=>{
      jwt.sign({result},process.env.jwtKey,{expiresIn: '30000d'},(err,token)=>{

        res.json({token})
        vartoken=token;
      })
    });
  });

  //console.warn(req.body);
 
 //res.end("hellowwwwww my boyssssss");
})
  

app.get('/login', (req,res)=>{
  res.render('login');
})

app.post('/login',jasonParser,function(req,res){
  User.findOne({email:req.body.email}).then((data)=>{
    console.warn(data);
    var password2 = req.body.password;
    bcrypt.compare(password2, data.password, function(err, result) {
    if (result) {
      console.warn("matches bruhhh")
      jwt.sign({data},process.env.jwtKey,{expiresIn: '30000d'},(err,token)=>{
        res.json({token})
        vartoken=token;
        console.warn(vartoken);
      })
    }
    else {
      console.warn("Invalid password!");
    }
});
  })

  //res.end("done");
})

app.get('/secretpage',verifyToken, (req,res)=>{
  res.render('secretPage')
})


app.get('/users',verifyToken,function(req,res){
  User.find().then((result)=>{
    res.json(result)
  })
})

function verifyToken(req,res,next){
  
    //req.token=bearer[1]
    console.warn(req.headers.authorization);
    jwt.verify(vartoken,process.env.jwtKey,(err,authData)=>{
      if(err)
      res.redirect('/');
      else
      next();
    })

  }




// Server setup 
app.listen(process.env.PORT); 