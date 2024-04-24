var mongoose = require('mongoose');

const Schema = mongoose.Schema

const ProblemSchema = new Schema({
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
examples:{
    type:String,
    required:true
},

},{timestamps:true}
)

const problems = mongoose.model('problems',ProblemSchema);
module.exports={
    problems
}