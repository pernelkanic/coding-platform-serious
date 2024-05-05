import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';
import rabbit from '../Helpers/rabbit.js';
import redisClient from '../Helpers/redis.js';
import submission from '../Models/submissions.js';
export const runCode= async(req,res)=>{
    try{
    const {code , language} = req.body;
    const languages =['py' ,'java' , 'cpp' , 'js'];
    if(code == undefined){
        return res.status(400).json({
            success :false,
            message:"The code field is required"
        })
    }
    if(!languages.includes(language)){
        res.status(400).json({
            success :false,
            message:"unsupported language"
        })
        return;
    }
    const id = uuid();
    const data = {
        id, 
        code, 
        language
    }
    await rabbit.sendToQueue('codequeue' , data);
   
    console.log("sent to the queue chill mf!!");
 
    const respforredis = {
        status :'pending',
        
    }
    await redisClient.set(id, JSON.stringify(respforredis));
    setTimeout(() => {
        console.log("Delayed for 3second.");
      }, "3000");

    

    return res.status(200).json({
        success :true,
        message:'code execution is pending',
        requestId:id
    })
    

}

catch(e){
    console.log(e);
    res.status(500).json({
        success:false,
        message:e,
    })
}
}



export const submitCode =  async(req, res)=>{
    try{
        const{userId , code , language , problemId } = req.body;
        const userid =  new mongoose.Types.ObjectId(userId);
        const problemid  =  new mongoose.Types.ObjectId(problemId);
        
        const submissioncreate  = await submission.create({ 
            problemId:problemid ,
            userId:userid
            ,code
            ,language });
        
        res.status(200).json(submissioncreate);
}   
    catch(e){
        throw new Error("error failed when submitting backend" + e)
    }
}



export const getSubmissionById = async(req,res)=>{
try{
    const {id}  = req.params;
    const result = await redisClient.get(id);
    console.log(result);
    if(res == null){
        return res.status(404).json({
            success:false,
            message:"not found"
        })
    }
    return res.status(200).json({
        success :true,
        message:result
      
    })  
}
catch(e){
    console.log(e);
    res.status(500).json({
        success:false,
        message:`${e}`
    })
}
}