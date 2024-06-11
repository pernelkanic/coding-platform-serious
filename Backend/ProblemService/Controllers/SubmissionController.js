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
   
    console.log("sent to the queue ");
 
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
      
        const submissioncreate  = await submission.create({ 
            problemId:problemId ,
            userId:userId
            ,code
            ,language });
        
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
        let response = {};

         response = {
            success: true,
            message: result
        }
        return response;
    };

    const timeout = 30000;
    const startTime = Date.now();
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    let flag = true;
    while (true) {
        const response = await checkCondition();
        const parsedMessage = JSON.parse(response.message);
        const status = parsedMessage.status;
       
        console.log(status);
        
        if (status === 'accepted' || status === 'rejected' ) {
             res.status(200).json(response);
            return;
            
        } 
        else if(status === 'Error'){
            
            res.status(200).json(
                {
                    
                        success: false,
                        message: response
                    
                }
            );
           
            break;
        }
        

        if (Date.now() - startTime >= timeout) {
           return res.status(200).json({
                success: false,
                message: "Timeout exceeded"
            });
          
           
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
catch(e){
    
   return res.status(200).json({
        success:false,
        message:`${e}`
    })
}
}