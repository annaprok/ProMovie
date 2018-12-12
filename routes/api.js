const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const passport=require('passport');
const bodyParser = require('body-parser');
const Film = require('../models/films.js');


const User = require('../models/users.js');
const Collection = require('../models/collection.js');
const mustache = require('mustache-express');
const BasicStrategy = require('passport-http').BasicStrategy;
const busboyBodyParser = require('busboy-body-parser');
let f = new Film.class();
let film = new Film.class();
let user = new User.class();
let collection = new Collection.class();

let pageCount =1;

let pageSize = 5;

passport.use(new BasicStrategy(
    function(userid, password, done) {
      User.model.findOne({ login: userid }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.validatePassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

router.use(express.static('public'));


router.use(express.static(path.join(__dirname, '../data/fs')));
let fs = require('fs');
router.get('/', function(req, res) {
        res.json({});
    
    
});

router.get('/me', passport.authenticate('basic', { session: false }),
function(req, res) {
    console.log("on api/me");
    res.json({
                "username":req.user.login,
                "userid":req.user.fullname
                });

});

router.get('/', passport.authenticate('basic', { session: false }),
function(req, res) {
    console.log("on api/me");
    res.json({
                current_username:"http://localhost:3000/api/v1/me",
                "get_films":"http://localhost:3000/api/v1/films",
                "get_film_by_id":"http://localhost:3000/api/v1/films/:id",
                "create_new_film":"http://localhost:3000/api/v1/films/new",
                "delete_film_by_id":"http://localhost:3000/api/v1/films/delete?id=:id",
                "find_film_by_filmname":"http://localhost:3000/api/v1/search/films"
                });

});

router.get('/films/',passport.authenticate('basic', { session: false }), function(req, res) {
  console.log ("user"+req.user);
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
                      page.status = "/api/v1/films?page=" + (i+1);
                  }
                  p.pages[i] = page;
              }
              // res.render('films',
              // {
              //     films: filmsList,
              //     pageSize: pageSize,
              //     totalFilms: totalFilms,
              //     currentPage: currentPage,
              //     pages:p.pages
              // });
              res.json({
                films: filmsList,
                pageSize: pageSize,
                totalFilms: totalFilms,
                currentPage: currentPage,
                pages:p.pages
            });
          })
      .catch(err => res.send(err.toString()));
  
});

router.get('/film/:id',passport.authenticate('basic', { session: false }), function(req, res) {
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
          //res.render('film', data);
          res.json(data);
      }
      
  })
  .catch(err => {
      res.send(err.toString());
      console.err(err);
  });
  }
  
});


router.post('/films/new',passport.authenticate('basic', { session: false }), function(req, res) {

  let img="/"+req.files.filmImg.name;
  console.log(img);
  let flm = new Film.class(req.body.filmName, img, req.body.filmDscrptn, req.body.director,req.body.writers,req.body.stars,req.body.date, req.body.rate, req.body.duration);
  film.insert(flm)
  .then(()=>{ 
          console.log("onInsert");
          let filmId = flm._id;
          let s = '/films/'+ filmId;
          let pa=path.join(__dirname, '../data/fs')+img;
          console.log(req.filmImg);
          fs.writeFile(pa,Buffer.from(req.files.filmImg.data),err=>{
              if(err){
                console.error(err);
                res.status(500).send(err.toString());
              }
              else{res.status(201).json(flm);}
          });
  })
  .catch(err => {
          console.error(err);
          res.status(500).send(err.toString());
      }
  );
  });

  /*router.post('/films/delete',passport.authenticate('basic', { session: false }), function(req, res) {
      //console.log("POST"+JSON.stringify(req.bodyid));
      film.delete(req.body.id)
      .then(() => {
              console.log("result");
              res.sendStatus(200);
          })
      .catch(err => {
              console.error(err);
              res.send(err.toString())
          }
      );
      
  });*/

  router.delete('/films/:id',passport.authenticate('basic', { session: false }), function(req, res) {
    //console.log("POST"+JSON.stringify(req.bodyid));
    film.delete(req.params.id)
    .then(() => {
            console.log("result");
            res.sendStatus(200);
        })
    .catch(err => {
            console.error(err);
            res.send(err.toString())
        }
    );
    
});

  /*router.post('/films/update',passport.authenticate('basic', { session: false }), function(req, res) {
    //console.log("POST"+JSON.stringify(req.bodyid));
    let img="/"+req.files.filmImg.name;
  console.log(img);
  let flm = new Film.class(req.body.id,req.body.filmName, img, req.body.filmDscrptn, req.body.director,req.body.writers,req.body.stars,req.body.date, req.body.rate, req.body.duration);
  flm.filmHr = '/films/'+req.body.id;
  flm._id=req.body.id;
    film.update(req.body.id,flm)
    .then((newFilm) => {
            console.log("result");
            let pa=path.join(__dirname, '../data/fs')+img;
            console.log(req.filmImg);
            fs.writeFile(pa,Buffer.from(req.files.filmImg.data),err=>{
                if(err){
                  console.error(err);
                  res.status(500).send(err.toString());
                }
                else{res.status(201).json(newFilm);}
            });
            //res.sendStatus(200);
        })
    .catch(err => {
            console.error(err);
            res.send(err.toString())
        }
    );
    
});*/

router.put('/films/:id',passport.authenticate('basic', { session: false }), function(req, res) {
    //console.log("POST"+JSON.stringify(req.bodyid));
    let img="/"+req.files.filmImg.name;
  console.log(img);
  let flm = new Film.class(req.params.id,req.body.filmName, img, req.body.filmDscrptn, req.body.director,req.body.writers,req.body.stars,req.body.date, req.body.rate, req.body.duration);
  flm.filmHr = '/films/'+req.body.id;
  flm._id=req.params.id;
    film.update(req.params.id,flm)
    .then((newFilm) => {
            console.log("result");
            let pa=path.join(__dirname, '../data/fs')+img;
            console.log(req.filmImg);
            fs.writeFile(pa,Buffer.from(req.files.filmImg.data),err=>{
                if(err){
                  console.error(err);
                  res.status(500).send(err.toString());
                }
                else{res.status(201).json(newFilm);}
            });
            //res.sendStatus(200);
        })
    .catch(err => {
            console.error(err);
            res.send(err.toString())
        }
    );
    
});

  router.get('/search/films',passport.authenticate('basic', { session: false }), function(req, res) {
      f.getAll()
          .then(films => {
                  console.log(JSON.stringify(films));
                  let arr=films;
                  function func(el,ind, arr) {
                  
                      let reg = RegExp(req.query.search,"i");
                      console.log(reg.toString());
                      console.log(el.filmName);
                         return reg.test(el.filmName);
                   }
                  let el = arr.filter(func);
               console.log(JSON.stringify(el));
              res.status(200).json(el);
          }
          )
          .catch(err => res.send(err.toString()));
    });

///////////////////////////Users

router.get('/users',passport.authenticate('basic', { session: false }), function(req, res) {
    console.log ("user"+req.user);
    let currentPage = 1,
    usersArrays = [], 
    usersList = [];
     user.getAll()
      .then(items =>
          { 
              let p,page;
              p = {"pages" : [] };
              console.log( JSON.stringify( items, null, 4));
              let arr = items;
              let totalUsers = arr.length;
                  
              while (arr.length) {
              //console.log("c" + JSON.stringify(arr));
              usersArrays.push(arr.splice(0, pageSize));
                      
              }
              console.log("arrays" + JSON.stringify(usersArrays));
              
              if (typeof req.query.page !== 'undefined') {
                  console.log("cur0 " + req.query.page);
                  currentPage = +req.query.page;
                  console.log("cur" + currentPage);

              }
                      
                  //show list of students from group
                  
              console.log ("len" + totalUsers);
              usersList = usersArrays[+currentPage -1 ];
              console.log ("list" + JSON.stringify(arr));
              let k = Math.trunc (( totalUsers - 1) / 5) + 1;
              for ( let i = 0; i < k; i++){
                  let page = {"id" : "", "status" : ""};
                  page.id = i+1;
                  console.log ( req.query.page);
                  if(i == req.query.page-1){
                      page.status = "";
                      
                  }
                  else{
                      page.status = "/api/v1/users?page=" + (i+1);
                  }
                  p.pages[i] = page;
              }
              res.json({
                users: usersList,
                pageSize: pageSize,
                totalUsers: totalUsers,
                currentPage: currentPage,
                pages:p.pages
            });
          })
      .catch(err => res.send(err.toString()));
});




router.get('/users/:id',passport.authenticate('basic', { session: false }), function(req, res) {
    let str = 'user';
        if(!req.user.isAdmin)
            {
                res.send(401);
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
                        //res.render('user', data);
                        res.json(data);
                    }
                    
                })
                .catch(err => {
                    res.send(err.toString());
                    console.err(err);
                });
            }
});

router.post('/users/new',passport.authenticate('basic', { session: false }), function(req, res) {

    let img="/"+req.files.usrAva.name;
    console.log(img);
    let admin,role=0;
    if(req.body.isAdmin == "admin"){
        admin=true;
        role=1;
    }
    let usr = new User.class(req.body.login,role, req.body.fullname,Date.now(),img,admin,req.body.bio,req.body.email);
    let pas=req.body.password;
    usr.setPassword(pas);
    user.insert(usr)
    .then(()=>{ 
            //console.log(img);
            let pa = path.join(__dirname, '../data/fs') + img;
            fs.writeFile(pa,Buffer.from(req.files.usrAva.data),err=>{
                if(err){
                  console.error(err);
                  res.status(500).send(err.toString());
                }
                res.status(201).json(usr);
            });
    })
    .catch(err => {
            console.error(err);
            res.sendStatus(500).send(err.toString());
        }
    );
    });

router.post('/users/delete',passport.authenticate('basic', { session: false }), function(req, res) {
        //console.log("POST"+JSON.stringify(req.bodyid));
        user.delete(req.body.id)
        .then(() => {
                console.log("result");
                res.sendStatus(200);
            })
        .catch(err => {
                console.error(err);
                res.send(err.toString())
            }
        );
        
});

////////////////////////////Collections

router.get('/collections',passport.authenticate('basic', { session: false }), function(req, res) {
    console.log ("user"+req.user);
    let currentPage = 1,
    colArrays = [], 
    colsList = [];
    collection.getAll()
      .then(items =>
          { 
              let p,page;
              p = {"pages" : [] };
              console.log( JSON.stringify( items, null, 4));
              let arr = items;
              let totalCollections = arr.length;
                  
              while (arr.length) {
              //console.log("c" + JSON.stringify(arr));
              colArrays.push(arr.splice(0, pageSize));
                      
              }
              console.log("arrays" + JSON.stringify(colArrays));
              
              if (typeof req.query.page !== 'undefined') {
                  console.log("cur0 " + req.query.page);
                  currentPage = +req.query.page;
                  console.log("cur" + currentPage);

              }
                      
                  //show list of students from group
                  
              console.log ("len" + totalCollections);
              colsList = colArrays[+currentPage -1 ];
              console.log ("list" + JSON.stringify(arr));
              let k = Math.trunc (( totalCollections - 1) / 5) + 1;
              for ( let i = 0; i < k; i++){
                  let page = {"id" : "", "status" : ""};
                  page.id = i+1;
                  console.log ( req.query.page);
                  if(i == req.query.page-1){
                      page.status = "";
                      
                  }
                  else{
                      page.status = "/api/v1/collections?page=" + (i+1);
                  }
                  p.pages[i] = page;
              }
              res.json({
                collections: colsList,
                pageSize: pageSize,
                totalCollections: totalCollections,
                currentPage: currentPage,
                pages:p.pages
            });
          })
      .catch(err => res.send(err.toString()));
   

});
router.get('/collections/:id',passport.authenticate('basic', { session: false }), function(req, res) {
    //let str = 'film';
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
    console.log("get col by id");
    let x={
        _id:"",
        colName:"",
        colDscrptn:"",
        films:[]};
    collection.getById(req.params.id)
    .then((data)=>{
        if(data === 'undefined'){
            res.sendStatus(404).send(`Collection with number ${id} is not defined!`);
        }
        else{
            x.colName=data.colName;
            x.colDscrptn=data.colDscrptn;
            x._id=data._id;
            console.log("colData"+data);
            return Collection.model.populate(data, {path: 'filmsId'});
        }
        
    })
    .then((f)=>{
                 x.films=f.filmsId;

                //res.render('collection', x);
                res.json(x);
    })
    .catch(err => {
        res.send(err.toString());
        console.err(err);});
    }
    
});


router.post('/collections/new',passport.authenticate('basic', { session: false }), function(req, res) {

    let ids = req;
    console.log(req);
    let col = new Collection.class(req.body.colName, ids,req.body.filmDscrptn);
    collection.insert(col)
    .then(()=>{ 
            console.log("onInsert");
            //let filmId = col._id;
            //let s = '/collections/'+ filmId;
                 //res.redirect(s);
                 res.json(col);
    })
    
    .catch(err => {
            console.error(err);
            res.status(500).send(err.toString());
        }
    );
    });

    router.get('/collections/search',passport.authenticate('basic', { session: false }), function(req, res) {
        collection.getAll()
            .then(films => {
                    console.log(JSON.stringify(films));
                    let arr=films;
                    function func(el,ind, arr) {
                    
                        let reg = RegExp(req.query.search,"i");
                        console.log(reg.toString());
                        console.log(el.colName);
                           return reg.test(el.colName);
                     }
                    let el = arr.filter(func);
                 console.log(JSON.stringify(el));
                /*res.render('collections',{
                films: el,
                value: req.query.search})*/
                res.json(el);
            }
            )
            .catch(err => res.send(err.toString()));
      });


    
    


      router.post('/collections/delete', function(req, res) {
    //console.log("POST"+JSON.stringify(req.bodyid));
    collection.delete(req.body.id)
    .then(() => {
            console.log("result");
            //res.redirect('../collections');
            res.sendStatus(200);
        })
    .catch(err => {
            console.error(err);
            res.send(err.toString())
        }
    );
    
});



module.exports={
    "router":router,
}

