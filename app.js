//jshint esversion:6
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
const PORT=process.env.PORT;

const bcrypt=require('bcrypt');
const saltRounds=Number(process.env.saltRounds);

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const User=mongoose.model('User', userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const username=req.body.username;
    const pass=req.body.password;
    User.findOne({email:username}).then(foundUser=>{
        if(foundUser){
            bcrypt.compare(pass, foundUser.password, function(error, result){
                if(result===true){
                    res.render("secrets");
                }else{
                    res.render("login");
                }
            });
        }else{
            console.log(foundUser);
        }
    }).catch(err=>{console.log(err.message);})
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        User.create({email:req.body.username, password:hash})
                .then(res.render("secrets"))
                .catch(err=>{console.log(err.message);});
    });
            
            

        

    

    
});

app.get("/logout", function(req, res){
    res.render("home");
});

app.get("/submit", function(req, res){
    
});


app.listen(PORT, function(){
    console.log(`App listening to ${PORT}`);
});
