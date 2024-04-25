import problem from "../Models/Problem.js";
 
const newprob  = problem;
 export const getProblems =async (req,res)=>{
   try{
    const newProblem = await newprob.find({}).sort({createdAt:-1});
    
    return res.status(200).json(newProblem);
   
}
catch(err){
    res.status(404).json({message:err.message})

}
}
export const setProblems =async (req,res)=>{
    const {title,description,examples} = req.body;
    console.log(examples);
    try{
        const problemscreate  = await newprob.create({title,description,examples});
        res.status(200).json(problemscreate);
    
 }
 catch(err){
     res.status(400).json({message:err.message})
 
 }
 }
