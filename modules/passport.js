


const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users.js');
let u = new User.class();
module.exports = function(passport) {
    
    passport.use(new LocalStrategy(function(username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        console.log("local-login");
        User.model.findOne({ 'login' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
                console.log("error local-login");
                return done(err);
        }
    
            // if no user is found, return the message
            if (!user){
                console.log('No user found.');
                return done(null, false); // req.flash is the way to set flashdata using connect-flash
                console.log("error local-login no user");
            }
    
            // if the user is found but the password is wrong
            if (!user.validatePassword(password)){
                console.log('Oops! Wrong password.');
                return done(null, false); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
    
            return done(null, user);
        });
    
    }));
    passport.use('local-signup',
    new LocalStrategy(function(req,username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'login' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false);
            } else {

                // if there is no user with that email
                // create the user
                let img="/"+req.files.avaUrl.name;
    
                let newUser = new User.class(req.body.login,0, req.body.fullname,Date.now(),img,false,req.body.usrBio,"some email");
  
                newUser.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
    
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        u.getById(id)
        .then((user)=>{
            done(null,user);
            
        })
        .catch(err => {;
            console.err(err);
            done(err, null);});/*(id, function(err, user) {
            done(err, user);
        });*/
    });
    
    

};


