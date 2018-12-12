const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');


const Actor = require('../models/actors.js');
const mustache = require('mustache-express');
const LocalStrategy = require('passport-local').Strategy;
const busboyBodyParser = require('busboy-body-parser');
let fs = require('fs');
const passport = require('passport');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
require('../modules/passport.js')(passport);


let actor = new Actor.class();

router.use(express.static('public'));
router.use(busboyBodyParser({uploadDir:path.join(__dirname, '../data/fs')}));//


router.use(express.static(path.join(__dirname, '../data/fs')));


router.get('/', function(req, res) {
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
                actor.getAll()
                    .then(items =>
                        { 
                            res.render('actors',
                            {
                                actors: items,
                            });
                        })
                    .catch(err => res.send(err.toString()));
                }
});

router.get('/new', function(req, res) {
 
    let str = 'newActor';
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

    let img = "/" + req.files.actorImg.name;
        console.log(img);
        let act = new Actor.class(req.body.fullname, img, req.body.bio, req.body.born, req.body.isAlive);
        actor.insert(act)
        .then(()=>{ 
                let userId = act._id;
                let s = '/actors/'+ userId;
                let pa = path.join(__dirname, '../data/fs')+img;
                fs.writeFile(pa,Buffer.from(req.files.actorImg.data));
                res.redirect(s);
        })
        .catch(err => {
                console.error(err);
                res.sendStatus(500).send(err.toString());
            }
        );
        
    });

router.get('/:id', function(req, res) {
    let str = 'actor';
                console.log("get actor by id + "+req.params.id);
                actor.getById(req.params.id)
                .then((data)=>{
                    if(data === 'undefined'){
                        res.sendStatus(404).send(`Actor with number ${id} is not defined!`);
                    }
                    else{
                        console.log("data" + JSON.stringify(data));
                        res.render('actor', data);
                    }
                    
                })
                .catch(err => {
                    res.send(err.toString());
                    console.error(err);
                });
            
});

    
    module.exports = {
        "router" : router
    }