"use strict";
let fs = require('fs');
const crypto = require('crypto');
const inputString="data/users.json";
//const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: { type: String },
    role: { type: Number },
    fullname: { type: String },
    registeredAt: { type: Date},
    avaUrl: { type: String },
    isAdmin: { type: Boolean },
    password: { type: String },
    salt: { type: String },
    bio: { type: String },
    hr: { type: String },
    email: { type: String }
    
 });


  UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, "salt", 10000, 512, 'sha512').toString('hex');
    if(this.password === hash){
        console.log("true");
    }
    return this.password === hash;

  };
  const UserModel = mongoose.model('User', UserSchema);

 

class User{
    constructor(login,role,fullname,registeredAt,avaUrl,isAdmin,bio,email) {
                this._id = new mongoose.Types.ObjectId();
                this.login=login;
                this.fullname=fullname;
                this.role = role;
                this.registeredAt = registeredAt;
                this.fullname = fullname;
                this.avaUrl = avaUrl;
                this.isAdmin = isAdmin;
                this.password="";
                this.bio=bio;
                this.hr='/users/'+this._id;
                this.email=email;
                this.salt="salt";
      }

      getAll(){ 
        return UserModel.find();
    }
    getById(id){ 
        console.log("Find user by id");
        return UserModel.findById(id).exec();
    }
    insert(x){
        return new UserModel(x).save();
    }
    update(id, x){
        return UserModel.findByIdAndUpdate(id,x,{new:true}).exec();
    }
    delete(id){
        return UserModel.remove({"_id": id });
    }
    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(password,  "salt", 10000, 512, 'sha512').toString('hex');
    };
      
       
       
};



module.exports =  {
    class: User,
    model:UserModel,
    scema:UserSchema,
    setPsv:UserSchema.methods.setPassword
};