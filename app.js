const express = require("express"); 
const app = express(); 
const mongoose=require('mongoose');
const User=require('./models/user');
const bodyParser=require('body-parser');
const jasonParser=bodyParser.json();
const bcrypt = require ('bcrypt');
const saltRounds = 10;

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
app.post('/resister',jasonParser,function(req,res){
    
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    console.warn(hash);
  });
  
  res.end("hellowwwwww my boyssssss");
})
  

// Server setup 
app.listen(3000); 