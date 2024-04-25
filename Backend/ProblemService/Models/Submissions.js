import mongoose from 'mongoose'

const Schema = mongoose.Schema

const submissionSchema = new Schema(
	{
		user: {
			
                clerkUserId: { type: String, unique: true, required: true },
           
              
		},
		code: {
			type: String
		},
		lang: {
			type: String
		},
        problems:[{
            Name:{
               type:String
             },
             
     
           }],
	},
	{
		timestamps: true
	}
)

const Submission = mongoose.model('Submission', submissionSchema)

export default Submission