import { v4 as uuid } from 'uuid';

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
    }
    const id = uuid();
    const data = {
        id, 
        code, 
        language
    }
    await rabbit.send('codequeue' , data);
    
    const respforredis = {
        status :'pending',
        
    }
    await redisclient.set(id, JSON.stringify(respforredis));
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
export const getSubmissionById = async(req,res)=>{
try{
    const {id}  = req.params;
    const result = await redisclient.get(id);
    console.log(res);
    if(res == null){
        return res.status(404).json({
            success:false,
            message:"not found"
        })
    }
    return res.status(200).json({
        success :true,
        message:res
      
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