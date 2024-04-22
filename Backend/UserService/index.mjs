import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
dotenv.config();
const app = express();
app.use(cors());
app.use(morgan("common"));
app.disable('etag');

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('listening on port ' , process.env.PORT);
    })
})
.catch((err)=>{
    console.log(err);
})