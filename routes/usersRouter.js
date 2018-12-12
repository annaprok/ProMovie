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

let pageCount = 1;

let user = new User.class();

router.use(express.static('public'));
router.use(busboyBodyParser({uploadDir:path.join(__dirname, '../data/fs')}));//


let pageSize = 5;



router.use(express.static(path.join(__dirname, '../data/fs')));


router.get('/', function(req, res) {
    console.log ("user"+req.user);
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
        if(!req.user.isAdmin)
            {
                res.send(404);
            }
            else{
                user.getAll()
                    .then(items =>
                        { 
                            

                            res.render('users',
                            {
                                userTbl: items,
                            });
                        })
                    .catch(err => res.send(err.toString()));
                }
            }
    
});





router.get('/new', function(req, res) {
 
    let str = 'newUser';
        if(!req.user)
        {
            res.redirect("/auth/login");
        }
        else{
            if(!req.user.isAdmin)
            {
                res.send(404);
            }
            else{
                res.render(str,{});
            }
        }
});

router.post('/new', function(req, res) {

    let img = "/" + req.files.usrAva.name;
        console.log(img);
        let admin = false, role = 0;
        if(req.body.isAdmin == "on"){
            admin = true;
            role = 1;
        }
        let usr = new User.class(req.body.login, role, req.body.fullname, Date.now(), img, admin, req.body.bio, req.body.email);
        let pas = req.body.password;
        usr.setPassword(pas);
        user.insert(usr)
        .then(()=>{ 
                //console.log(img);
                console.log("onInsertUser " + JSON.stringify(user));
                let userId = usr._id;
                let s = '/users/'+ userId;
                let pa = path.join(__dirname, '../data/fs')+img;
                fs.writeFile(pa,Buffer.from(req.files.usrAva.data));
                res.redirect(s);
        })
        .catch(err => {
                console.error(err);
                res.sendStatus(500).send(err.toString());
            }
        );
        
    });

    router.post('/delete', function(req, res) {
            user.delete(req.body.id)
            .then(() => {
                    console.log("result");
                    res.redirect('../../users');
                })
            .catch(err => {
                    console.error(err);
                    res.send(err.toString())
                }
            );
        
    });

    router.post('/onupdate', function(req, res) {
        let str = 'updateUser';
        if(!req.user)
        {
            res.redirect("/auth/login");
        }
        else{
            console.log("usrId " + req.body.id);
            user.getById(req.body.id)
            .then((data)=>{
                if(data === 'undefined'){
                    res.sendStatus(404).send(`User with number ${req.body.id} is not defined!`);
                }
                else{
                    console.log("data  "+ data);
                res.render(str, data);
                }
            })
            .catch(err => {
                res.send(err.toString());
                console.err(err);
            });
        }
        
});

    router.post('/update', function(req, res) {
        if(!req.user)
            {
                res.redirect("/auth/login");
            }
            else{
                let img = req.body.avaUrl;
                if(req.files.usrAva!=undefined){
                    img = "/" + req.files.usrAva.name;
                }
                
                console.log(img);
                let role = 0, admin = 0;
                if(req.user.isAdmin){
                    role = req.body.role;
                    admin = (req.body.isAdmin == "on");
                    console.log("Admin " + req.body.isAdmin);
                }
                console.log("Admin " + req.body.isAdmin);
                let usr =  new User.class(req.body.login, role, req.body.fullname, Date.now(), img, admin, req.body.bio, req.body.email);
                if(req.body.password!=""){
                    usr.setPassword(req.body.password);
                    console.log("Password-true");
                }
                else{
                    usr.password=req.body.passPrev;
                    console.log("Password-undefined");
                }
                console.log("New user" +JSON.stringify(usr));
                usr.hr = '/users/' + req.body.id;
                usr._id = req.body.id;
                    user.update(req.body.id, usr)
                    .then((newUser) => {
                            console.log("result "+newUser);
                            let userId = newUser._id;
                                    let s = '/users/'+ userId;
                            if(req.files.usrAva != undefined){
                            let pa = path.join(__dirname, '/../data/fs') + img;
                            fs.writeFile(pa, Buffer.from(req.files.usrAva.data), err => {
                                if(err){
                                    console.error(err);
                                    res.status(500).send(err.toString());
                                }
                                else{
                                    res.redirect(s);
                                }
                            });
                        }
                        else{
                            res.redirect(s);
                        }
                        })
                    .catch(err => {
                            console.error(err);
                            res.send(err.toString())
                        }
                    );
                }
    });


    router.get('/:id', function(req, res) {
        let str = 'user';
        if(!req.user)
        {
            res.redirect("/auth/login");
        }
        else{
            if(!req.user.isAdmin)
                {
                    res.send(404);
                }
                else{
                    console.log("get user by id + "+req.params.id);
                    user.getById(req.params.id)
                    .then((data)=>{
                        if(data === 'undefined'){
                            res.sendStatus(404).send(`User with number ${id} is not defined!`);
                        }
                        else{
                            console.log("data" + JSON.stringify(data));
                            console.log("user" + JSON.stringify(req.session.user));
                            res.render('user', data);
                        }
                        
                    })
                    .catch(err => {
                        res.send(err.toString());
                        console.error(err);
                    });
                }
            }
        
    });
    
    module.exports = {
        "router" : router
    }