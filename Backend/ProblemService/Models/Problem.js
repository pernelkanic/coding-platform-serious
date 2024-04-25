import mongoose from "mongoose";
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

const problem =  mongoose.model('problems',ProblemSchema);
export default problem;