import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { Webhook } from 'svix';
import User from './Models/User.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(morgan("common"));
app.disable('etag');
app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhook') {
      next(); // Do nothing with the body because I need it in a raw state.
    } else {
      express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from clerk.
    }
  });
  app.use((req,res,next)=>{
      console.log(req.path,req.method);
      next();
  })
app.post(
    '/api/webhook',
    bodyParser.raw({ type: 'application/json' }),
    async function (req, res) {
      try {
        const payloadString = req.body.toString();
        const svixHeaders = req.headers;

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(payloadString, svixHeaders);
        const { id, ...attributes } = evt.data;
        // Handle the webhooks
        const eventType = evt.type;
        if (eventType === 'user.created') {
          console.log(`User ${id} was ${eventType}`);

          const firstName = attributes.first_name;
         
          const lastName = attributes.last_name;

          const user = new User({
            clerkUserId: id,
            firstName: firstName,
            lastName: lastName,
          });

          await user.save();
          console.log('User saved to database');
        }
        res.status(200).json({
          success: true,
          message: 'Webhook received',
        });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    }
  );


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('listening on port ' , process.env.PORT);
    })
})
.catch((err)=>{
    console.log(err);
})