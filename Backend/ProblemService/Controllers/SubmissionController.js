import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';
import rabbit from '../Helpers/rabbit.js';
import redisClient from '../Helpers/redis.js';
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
      
        const problemid  =   ObjectId.createFromBase64(problemId);
        const userid =  ObjectId.createFromBase64(userId)
        console.log(userid);
        // const submissioncreate  = await submission.create({ 
        //     problemId:problemid ,
        //     userId:userid
        //     ,code
        //     ,language });
        
        res.status(200).json("done");
}   
    catch(e){
        throw new Error("error failed when submitting backend" + e)
    }
}



export const getSubmissionById = async(req,res)=>{
try{
    const {id}  = req.params;
    const checkCondition = async () => {
        const result = await redisClient.get(id);
        const response = {
            success: true,
            message: result
        };
        return response;
    };

    const timeout = 30000; // Timeout in milliseconds (adjust as needed)
    const startTime = Date.now();

    // Loop until the condition is met or timeout occurs
    while (true) {
        const response = await checkCondition();
        console.log(JSON.parse(response.message).status)
        // Check if the condition is met
        if ( JSON.parse(response.message).status === 'accepted' || JSON.parse(response.message).status === 'rejected'  ) {
            return res.status(200).json(response);
        }

        // Check if timeout has occurred
        if (Date.now() - startTime >= timeout) {
            return res.status(200).json({
                success: false,
                message: "Timeout exceeded"
            });
        }

        // Wait for a short interval before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
catch(e){
    console.log(e);
    res.status(500).json({
        success:false,
        message:`${e}`
    })
}
}