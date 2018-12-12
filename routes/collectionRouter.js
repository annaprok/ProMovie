const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const Film = require('../models/films.js');


const Collection = require('../models/collection.js');
const mustache = require('mustache-express');
const LocalStrategy = require('passport-local').Strategy;
const busboyBodyParser = require('busboy-body-parser');
let fs = require('fs');
const passport = require('passport');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
require('../modules/passport.js')(passport);

let collection = new Collection.class();
let film = new Film.class();

router.use(express.static('public'));
router.use(busboyBodyParser({uploadDir:path.join(__dirname, '../data/fs')}));//


let pageSize = 5;



router.use(express.static(path.join(__dirname, '../data/fs')));


router.get('/', function(req, res) {
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
    collection.getAll()
    .then(items =>
        { 
            res.render('collections',
            {
                collections: items,
            });
        })
    .catch(err => res.send(err.toString()));
    }
    
});



router.get('/new', function(req, res) {
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
        let str = 'newCollection';
        film.getAll()
        .then(items => { 
                console.log(items);
                res.render(str,
                    {
                        films:items
                    }
                );
        })
        .catch(err => {
                res.send(err.toString());
                console.err(err);
        });
    }
});

router.post('/new', function(req, res) {
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else {
        let ids = req.body.select;
        console.log(req.body.select);
        let col = new Collection.class(req.body.colName, ids, req.body.filmDscrptn);
        collection.insert(col)
        .then(() => { 
                console.log("onInsert");
                let filmId = col._id;
                let s = '/collections/'+ filmId;
                    res.redirect(s);
        })
        
        .catch(err => {
                console.error(err);
                res.sendStatus(500).send(err.toString());
            }
        );
    }
});

router.post('/delete', function(req, res) {
    collection.delete(req.body.id)
    .then(() => {
            console.log("result");
            res.redirect('../collections');
        })
    .catch(err => {
            console.error(err);
            res.send(err.toString())
        }
    );
        
});

router.get('/search', function(req, res) {
    collection.getAll()
        .then(films => {
                console.log(JSON.stringify(films));
                let arr = films;
                function func(el, ind, arr) {
                
                    let reg = RegExp(req.query.search, "i");
                    console.log(reg.toString());
                    console.log(el.colName);
                    return reg.test(el.colName);
                 }
                let el = arr.filter(func);
                console.log(JSON.stringify(el));
                res.render('collections',{
                collections: el,
                value: req.query.search})
        })
        .catch(err => res.send(err.toString()));
  });

  router.post('/add', function(req, res) {
    let ids = req.body.select;
    collection.getById(req.body.id)
            .then((data) => {
                data.filmsId.push(ids);
                return collection.update(data._id,data);
            })
            .then(newCol => {
                res.redirect(newCol.colHr);
            })
            .catch(err => res.send(err.toString()));
  });


router.get('/:id', function(req, res) {
        if(!req.user)
        {
            res.redirect("/auth/login");
        }
        else{
            console.log("get col by id");
            let x = {
                    _id : "",
                    colName : "",
                    colDscrptn : "",
                    films : [],
                    filmsAll : []
                };
            let promise1 = collection.getById(req.params.id)
            .then(data => {
                if(data === 'undefined'){
                    res.sendStatus(404).send(`Collection with number ${id} is not defined!`);
                }
                else {
                    x.colName = data.colName;
                    x.colDscrptn = data.colDscrptn;
                    x._id = data._id;
                    console.log("colData " + data);
                    return Collection.model.populate(data, {path: 'filmsId'});
                }
                
            });
            let promise2 = film.getAll();
            Promise.all(    
            [promise1,promise2])
            .then(values =>{
                x.films = values[0].filmsId;
                x.filmsAll = values[1];
                res.render('collection', x);
            })

            .catch(err => {
                res.send(err.toString());
                console.error(err);
            });
        }
        
});

    
    module.exports = {
        "router" : router
    }