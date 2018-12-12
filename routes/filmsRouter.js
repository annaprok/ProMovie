const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Film = require('../models/films.js');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../config/config.json');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: config.cloud.cloud_name,
    api_key: config.cloud.api_key,
    api_secret: config.cloud.api_secret
});

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

let pageCount =1;
let f = new Film.class();
let film = new Film.class();

router.use(express.static('public'));
router.use(busboyBodyParser({uploadDir:path.join(__dirname, '../data/fs')}));//


let pageSize = 5;



router.use(express.static(path.join(__dirname, '../data/fs')));

function handleFileUpload(req, res) {
    const fileObject = req.files.someFile;
    const fileBuffer = fileObject.data;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
        function (error, result) { 
            console.log(result, error) 
            // do stuff...
            // create web response
            res.send(result);
        })
        .end(fileBuffer);
    // ...
}


router.get('/', function(req, res) {
    console.log ("user"+req.user);
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
        let currentPage = 1,
        filmsArrays = [], 
        filmsList = [];
       f.getAll()
        .then(items =>
            { 
                let p,page;
                p = {"pages" : [] };
                console.log( JSON.stringify( items, null, 4));
                let arr = items;
                let totalFilms = arr.length;
                    
                while (arr.length) {
                //console.log("c" + JSON.stringify(arr));
                filmsArrays.push(arr.splice(0, pageSize));
                        
                }
                console.log("arrays" + JSON.stringify(filmsArrays));
                
                if (typeof req.query.page !== 'undefined') {
                    console.log("cur0 " + req.query.page);
                    currentPage = +req.query.page;
                    console.log("cur" + currentPage);

                }
                        
                    //show list of students from group
                    
                console.log ("len" + totalFilms);
                filmsList = filmsArrays[+currentPage -1 ];
                console.log ("list" + JSON.stringify(arr));
                let k = Math.trunc (( totalFilms - 1) / 5) + 1;
                for ( let i = 0; i < k; i++){
                    let page = {"id" : "", "status" : ""};
                    page.id = i+1;
                    console.log ( req.query.page);
                    if(i == req.query.page-1){
                        page.status = "";
                        
                    }
                    else{
                        page.status = "/films?page=" + (i+1);
                    }
                    p.pages[i] = page;
                }
                res.render('films',
                {
                    films: filmsList,
                    pageSize: pageSize,
                    totalFilms: totalFilms,
                    currentPage: currentPage,
                    pages:p.pages
                });
            })
        .catch(err => res.send(err.toString()));
    }
    
});



router.get('/new', function(req, res) {
 
    let str = 'newFilm';
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
        res.render(str,{});
    }
});

router.post('/new', function(req, res) {
    const fileObject = req.files.filmImg;
    const fileBuffer = fileObject.data;
    //let img=//"/"+req.files.filmImg.name;

    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
            function (error, result) { 
                if(error){
                    console.error(err);
                    res.sendStatus(500).send(err.toString());
                }
                console.log(result, error);
                let img = result.url;
                let flm = new Film.class(req.body.filmName, img, req.body.filmDscrptn, req.body.director,req.body.writers,req.body.stars,req.body.date, req.body.rate, req.body.duration);
                film.insert(flm)
                .then(()=>{ 
                        console.log("onInsert");
                        let filmId = flm._id;
                        let s = '/films/'+ filmId;
                        // let pa=path.join(__dirname, 'data/fs')+img;
                        // fs.writeFile(pa,Buffer.from(req.files.filmImg.data));
                        res.redirect(s);
                })
                .catch(err => {
                        console.error(err);
                        res.sendStatus(500).send(err.toString());
                    }
                );
            }
        )
        .end(fileBuffer);
    });

    router.post('/delete', function(req, res) {
        //console.log("POST"+JSON.stringify(req.bodyid));
        film.delete(req.body.id)
        .then(() => {
                console.log("result");
                res.redirect('../films');
            })
        .catch(err => {
                console.error(err);
                res.send(err.toString())
            }
        );
        
    });

    router.post('/update', function(req, res) {
        //console.log("POST"+JSON.stringify(req.bodyid));
        film.update(req.body.id)
        .then(() => {
                console.log("result");
                res.redirect('../films');
            })
        .catch(err => {
                console.error(err);
                res.send(err.toString())
            }
        );
        
    });
    router.get('/search', function(req, res) {
        let currentPage = 1,
            filmsArrays = [], 
            filmsList = [];
        film.getAll()
            .then(films => {
                    console.log(JSON.stringify(films));
                    let arr = films;
                    function func(el,ind, arr) {
                    
                        let reg = RegExp(req.query.search,"i");
                        console.log(reg.toString());
                        console.log(el.filmName);
                           return reg.test(el.filmName);
                     }
                    let el = arr.filter(func);
                    let p, page;
                    p = {"pages" : [] };
                    console.log( JSON.stringify( el, null, 4));
                    let array = el;
                    let totalFilms = array.length;
                        
                    while (array.length) {
                    //console.log("c" + JSON.stringify(arr));
                    filmsArrays.push(array.splice(0, 5));
                            
                    }
                    console.log("arrays" + JSON.stringify(filmsArrays));
                    
                    if (typeof req.query.page !== 'undefined') {
                        console.log("cur0 " + req.query.page);
                        currentPage = +req.query.page;
                        console.log("cur" + currentPage);
    
                    }
                            
                        //show list of students from group
                        
                    console.log ("len" + totalFilms);
                    filmsList = filmsArrays[+currentPage -1 ];
                    console.log ("list" + JSON.stringify(arr));
                    let k = Math.trunc (( totalFilms - 1) / 5) + 1;
                    for ( let i = 0; i < k; i++){
                        let page = {"id" : "", "status" : ""};
                        page.id = i+1;
                        console.log ( req.query.page);
                        if(i == req.query.page-1){
                            page.status = "";
                            
                        }
                        else{
                            page.status = "/films?page=" + (i+1);
                        }
                        p.pages[i] = page;
                    };
                res.render('films',{
                films: filmsList,
                value: req.query.search,
                resNum: totalFilms,
                pageSize: 5,
                currentPage: currentPage,
                pages:p.pages})
            }
            )
            .catch(err => res.send(err.toString()));
      });
    

    router.get('/:id', function(req, res) {
        if(!req.user)
        {
            res.redirect("/auth/login");
        }
        else{
        console.log("get film by id");
        f.getById(req.params.id)
        .then((data)=>{
            if(data === 'undefined'){
                res.sendStatus(404).send(`User with number ${id} is not defined!`);
            }
            else{
                console.log("data" + JSON.stringify(data));
                console.log("user" + JSON.stringify(req.session.user));
                res.render('film', data);
            }
            
        })
        .catch(err => {
            res.send(err.toString());
            console.err(err);
        });
        }
        
    });

    
    module.exports = {
        "router" : router
    }