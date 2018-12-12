"use strict";
let fs = require('fs');




const mongoose = require('mongoose');
const FilmSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filmImg: { type: String },
    filmHr: { type: String },
    filmDscrptn: { type: String },
    filmName: { type: String },
    writers: { type: String },
    stars: { type: String },
    date: { type: Date, default: Date.now },
    rate: { type: Number },
    duration: { type: Number },
    isAdmin:{type: Boolean},
    fullname:{type: String}

    
 });
 
 const FilmModel = mongoose.model('Film', FilmSchema);

 

class Film{
    constructor (name,filmImg,filmDscrptn,director,writers,stars,date,rate,duration) {
                    this._id = new mongoose.Types.ObjectId();
                    this.filmImg = filmImg;
                    this.filmHr = '/films/'+this._id;
                    this.filmDscrptn = filmDscrptn;
                    this.filmName = name;
                    this.director = director;
                    this.writers = writers;
                    this.stars = stars;
                    this.date = date;
                    this.rate = rate;
                    this.duration = duration;
                    this.isAdmin=false;
                    this.fullname="";

                
      }
    getAll(){ 
        return FilmModel.find();
    }
    getById(id){ 
        console.log("Find by id");
        return FilmModel.findById(id).exec();
        
        
    } 
    insert(x){
        console.log("Hey");
        return new FilmModel(x).save();
    }
    update(id, x){
        return FilmModel.findByIdAndUpdate(id,x,{new:true}).exec();
    }
    delete(id){
        return FilmModel.remove({"_id": id });
    }
};
    

module.exports =  {
    class: Film,
    model:FilmModel,
    scema:FilmSchema
};
