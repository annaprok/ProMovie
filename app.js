"use strict";
const config = require('./config/config.json');
const express = require('express');
const mongoose = require('mongoose');
const flash    = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const auth = require('basic-auth');

const User = require('./models/users.js');
const Film = require('./models/films.js');
const Actor = require('./models/actors.js');
const Collection = require('./models/collection.js');
let fs = require('fs');
const mustache = require('mustache-express');
const busboyBodyParser = require('busboy-body-parser');
//"mongodb://localhost:27017/proMovie",



let user = new User.class();
let film = new Film.class();
let collection = new Collection.class();
let actor = new Actor.class();
const app = express();
const path = require('path');
require('./modules/passport.js')(passport);
app.use(cookieParser());
app.use(session({
	secret: config.secret,
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dvygatfxn',
    api_key: '244943365867919',
    api_secret: 'gHvtuF7cxMDHu3VP-Tw43-SwtBQ'
});

  

const databaseURL = config.connectionString
const serverPort = 3000;
const connectOptions = { useNewUrlParser:true };


 
 const authRouter = require('./routes/auth.js').router;
 const devRouter = require('./routes/developer.js').router;
 const apiRouter = require('./routes/api.js').router;
 const filmsRouter = require('./routes/filmsRouter.js').router;
 const usersRouter = require('./routes/usersRouter.js').router;
 const collectionRouter = require('./routes/collectionRouter.js').router;
 const actorsRouter = require('./routes/actorsRouter.js').router;

 app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });
 
 

mongoose.connect(databaseURL,connectOptions)
    .then(() => console.log(`Database connected: ${databaseURL}`))
    .then(() => app.listen(process.env.PORT || serverPort, ()=> console.log(`Server started: ${serverPort}`)))
    .catch(err => console.log(`Start error: ${err}`));



app.use(busboyBodyParser({ limit: '5mb' }));

app.use("/auth", authRouter);
app.use("/developer/v1", devRouter);
app.use("/api/v1", apiRouter);
app.use("/films", filmsRouter);
app.use("/users", usersRouter);
app.use("/collections", collectionRouter);
app.use("/actors", actorsRouter);
// will open pubclic/ directory files for http requests
app.use(express.static('public'));
app.use(busboyBodyParser({ uploadDir:path.join(__dirname + "../", 'data/fs') }));//


app.use(express.static(path.join(__dirname, 'data/fs')));


const aboutData = {
    header:"What is ProMovie?",
    image:"images/hbirthday.jpg",
    imgName:"Happy Birthday!",
    text:"ProMovie is a new way of watching films and serials.</p><p> Here you can find complete information about the world premiers. Decide what film to watch and where using our database! ProMovie provides local movie showtimes, ticketing, trailers, critic and user reviews, personalized recommendations, photo galleries, entertainment news, quotes, trivia, box-office data, editorial feature sections and a universal Watchlist. Get personalized recommendations and discover new movies and shows you'll love! Share a review of your favorite movies and shows with the community of entertainment fans!</p><p>Join us!"
};



//////////////////////////

//
// view engine setup
const viewsDir = path.join(__dirname, 'views');
app.engine("mst", mustache(path.join(viewsDir, "partials")));
app.set('views', viewsDir);
app.set('view engine', 'mst');




app.get('/', (req, res) => {
    if(!req.user){
        res.render('index1', {}) ;
    }
    else{
        res.render('index', { isAdmin: req.user.isAdmin,
            fullname: req.user.fullname});
    }
});



app.get('/profile', function(req, res) {
    let str = 'user';
    if(!req.user)
    {
        res.redirect("/auth/login");
    }
    else{
        res.render(str, req.user);
    }
});


app.get('/about', function(req, res) {
    res.render('about',aboutData);
});

app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('err404', { url: req.url });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });





