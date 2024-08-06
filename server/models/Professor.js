const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
    
});

module.exports = mongoose.model('Professor', PostSchema);