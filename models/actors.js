"use strict";
let fs = require('fs');




const mongoose = require('mongoose');
const ActorSchema = new mongoose.Schema({
    __id: mongoose.Schema.Types.ObjectId,
    fullname: { type: String },
    actorImg: { type: String },
    bio: { type: String },
    born: { type: String },
    isAlive: { type: String },
    hr: { type: String }
 });
 
 const ActorModel = mongoose.model('Actor', ActorSchema);

 

class Actor{
    constructor (fullname,actorImg,bio,born,isAlive) {
                    this._id = new mongoose.Types.ObjectId();
                    this.actorImg = actorImg;
                    this.hr = '/actors/'+this._id;
                    this.bio = bio;
                    this.fullname = fullname;
                    this.born = born;
                    this.isAlive = isAlive;

                
      }
    getAll(){ 
        return ActorModel.find();
    }
    getById(id){ 
        console.log("Find by id");
        return ActorModel.findById(id).exec();
        
        
    } 
    insert(x){
        console.log("Hey");
        return new ActorModel(x).save();
    }
    update(id, x){
        return ActorModel.findByIdAndUpdate(id,x,{new:true}).exec();
    }
    delete(id){
        return ActorModel.remove({"_id": id });
    }
};
    

module.exports =  {
    class: Actor,
    model:ActorModel,
    scema:ActorSchema
};
