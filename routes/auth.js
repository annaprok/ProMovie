
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');


const User = require('../models/users.js');
const mustache = require('mustache-express');
const LocalStrategy = require('passport-local').Strategy;
const busboyBodyParser = require('busboy-body-parser');
let fs = require('fs');
const passport = require('passport');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
require('../modules/passport.js')(passport);


router.use(cookieParser());
router.use(session({
	secret: "Some_secret^string",
	resave: false,
	saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

//let funk = function(app) {
    //
    //const router = express.Router();
let user = new User.class();
//const path = require('path');
router.use(express.static('public'));
router.use(busboyBodyParser({uploadDir:path.join(__dirname, '../data/fs')}));//





router.use(express.static(path.join(__dirname, '../data/fs')));
router.get('/register', function(req, res) {
    let str = 'register';
    console.log(req.query.error);
    if(req.query.error){
        res.render(str,{err:req.query.error});
    }
    else{
        res.render(str,{});
    }
    
    
});

router.post('/register', function(req, res) {
    User.model.findOne({ 'login' :  req.body.login }, function(err, user) {
            // if there are any errors, return the error
            if (err){
                console.error(err);
                res.redirect("/auth/register?error=error");
            }

            // check to see if theres already a user with that email
            if (user) {
                res.redirect("/auth/register?error=Username+already+exists");
            } else {
    console.log("/"+req.files.avaUrl);
    let img="/"+req.files.avaUrl.name;
    console.log(img);
    
    let usr = new User.class(req.body.login,0, req.body.fullname,Date.now(),img,false,req.body.usrBio,"some email");
    console.log(req.body.login);
    let pas=req.body.password;
    usr.setPassword(pas);
    usr.insert(usr)
    .then(()=>{ 
            console.log("onInsert user");
            let userId = usr._id;
            let pa = path.join(__dirname, '../data/fs')+img;
            fs.writeFile(pa, Buffer.from(req.files.avaUrl.data));
            res.redirect("/auth/login");
    })
    .catch(err => {
            console.error(err);
            res.redirect("/auth/register?error=error");
        }
    );
    }});
    });

   
router.get('/login', function(req, res) {
        console.log("on login");
        let str = 'login';
        res.render(str,{});
});

router.post('/login',passport.authenticate('local', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/films');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on 
if (req.isAuthenticated())
    return next();

// if they aren't redirect them to the home page
res.redirect('/');
}

module.exports={
    "router":router
}