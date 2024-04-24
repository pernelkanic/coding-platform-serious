import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import submissionRouter from './Routes/Submissions';
const app = express();

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
//routes
app.use('/api/code' , submissionRouter)
app.use('/api/problem' , problemRouter)
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('listening on port ' , process.env.PORT);
    })
})
.catch((err)=>{
    console.log(err);
})