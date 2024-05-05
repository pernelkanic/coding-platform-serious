import mongoose from "mongoose";
const Schema = mongoose.Schema

const SubmissionSchema = new Schema({
problemId:{
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
},
userId:{
    type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
},
code:{
    type: String,
    required: true

},
language:{
    type:String,
    required:true
}


},{timestamps:true}
)

const submission =  mongoose.model('submission',SubmissionSchema);
export default submission;