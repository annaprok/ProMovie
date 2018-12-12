let count = 1;
//const inputString="data/collections.json";
const Film = require('./films.js');
const mongoose = require('mongoose');
const CollectionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filmsId: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Film' }],
    colDscrptn: { type: String },
    colName: { type: String },
    colHr: { type: String }
 });
 
 const CollectionModel = mongoose.model('Collection', CollectionSchema);

class Collection{
    constructor(name, films ,colDscrptn) {
                    this._id = new mongoose.Types.ObjectId();
                    this.filmsId =[films];
                    this.colDscrptn = colDscrptn;
                    this.colName = name;
                    this.colHr = '/collections/'+this._id;

                
      }
    getAll(){ 
        return CollectionModel.find();
    }
    getById(id){ 
        console.log("Find Collection by id");
        return CollectionModel.findById(id);
    } 
    insert(x){
        console.log("Hey");
        return new CollectionModel(x).save();
    }
    update(id, x){
        return CollectionModel.findByIdAndUpdate(id, x, { new:true }).exec();
    }
    delete(id){
        return CollectionModel.remove({ "_id": id});
    }
};
    

module.exports =  {
    class: Collection,
    model:CollectionModel
};