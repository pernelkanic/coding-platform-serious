import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CodeEditor from './CodeEditor';

export default function ProblemPage() {
    var useridtomongo = "6627e2cb20de2d1628a0416f"
    const { getToken } = useAuth();

    const mapformat ={
        "python":"py",
        "java":"java",
        "javascript":"js",
        "c++":"cpp",
        
    }
    const title = useParams().prob.substring(2,useParams().prob.lastIndexOf("$"))
    let probid = useParams().prob.substring(useParams().prob.lastIndexOf("$") + 1 , );

    
    const[runcode, setruncode] = useState("");
    const[runlang , setrunlang] = useState("");
    const[queid, setqueid] = useState(null);
    const[data, setdata] = useState(null);
    const [probdata , setprobdata] = useState([]);
    const[loading, setLoading] = useState(false);
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()
    React.useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/login")
        }
    }, [isLoaded])
    
 
    

    useEffect(
        ()=>{
            setLoading(true)
            fetch("http://localhost:5001/api/problem")
            .then((response)=>response.json())
            .then((data)=>{
                 
                setLoading(false);
                setprobdata(data);
            })
        }
        ,[]
    )

    //for getting the data from the redis
    useEffect(()=>{
        async function polling(){
        // This effect runs whenever queid changes
        console.log(queid); // This will print the updated value of queid
        await pollForResult();
    }
    polling();
}, [queid]);

//for saving into the db
useEffect(()=>{
    async function  saving(){
    saveToDB()
}
saving();
}, [data]);
   
//code for running the code in the worker
  const  handleRun =async (e)=>{
    e.preventDefault();

       
        const lang = mapformat[`${runlang}`];
        const bodyforrun={
            "code":`${runcode}`,
            "language":`${lang}`
        }
    
        
        try{

        const response = await fetch('http://localhost:5001/api/code/submissions', {
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${await getToken()}`
            },
            body: JSON.stringify(bodyforrun)
           });
           if (response.ok) {
            await response.json().then(data =>  setqueid(data.requestId));
           } else {
            console.error('Failed to execute code');
          }
         
            
        }catch(e){
            console.log('Error:', e);
        }
        
        
    }
    const saveToDB = async() =>{
        try{
        await fetch('http://localhost:5001/api/code/submit', {
                            method: 'post',
                            headers: {
                                'Content-Type':'application/json',
                                'Authorization':`Bearer ${await getToken()}`
                            },
                            body: JSON.stringify({
                                code:runcode,
                                language :runlang,
                                userId: useridtomongo,
                                problemId: probid
                            })
                   })
                }
                catch(e){
                    throw new Error("the error occured when saving to DB")
                }
    }
    const pollForResult = async () => {
        try{
            const res = await fetch(`http://localhost:5001/api/code/submissions/${queid}`)
            .then(response => response.json())
           
             const statusforreq = JSON.parse(res.message).status
             console.log(statusforreq);
                if(statusforreq === 'accepted'){
                    setdata(res);
                    
                }else{
                    
                    pollForResult(queid);

                }
            }
        
        catch(e){
            throw new Error("the code execution failed!" + e)
        }
    }
   
    //handle submission code
//  async   function handleSubmit(){
//     try{
//         await fetch(`http://localhost:5001/api/code/submissions/${data.requestId}`)
//         .then((response) => response.json())
//         .then((data)=>{
//             setdata(data)
//         })
//         if(data.status === 'accepted'){
//             //handle submission code here
//             try{
//                 await fetch('http://localhost:5001/api/code/submit', {
//                 method: 'post',
//                 headers: {
//                     'Content-Type':'application/json',
//                     'Authorization':`Bearer ${await getToken()}`
//                 },
//                 body: JSON.stringify({
//                     code:runcode,
//                     language :runlang,
//                     userId:userid,
//                     problemId: probid
//                 })
//        })
//        const data = await response.json();
//         console.log(data);
//         setdata(data);
//             }
//             catch(e){
//                 console.log("The error occured when saving to db");
//             }
//         }
//     }
//     catch(e){
//         throw new Error("the code execution at submission failed!")
//     }

//     }
  return (
    <>
        {!loading?(
            probdata.map((item , index)=>{
                if(title == item.title){
                return(
                    <div>
                    <p className="text-center   text-xl mt-4" key={index}>{item.title.toUpperCase()}</p>
                    <br></br>
                    
                    <p className="ml-3">Problem Description:</p>
                    <br></br>
                    <p className="w-94 ml-4">{item.description}</p>
                    <p className="mt-9 ml-8">Test Case 0:</p>
                    <p className="ml-12 mt-6">{item.examples.substring(0,35)}</p>
                    <p className="ml-12 mt-6">{item.examples.substring(35)}</p>
                   <div className=' flex  items-center flex-col mb-4 '>
                    <CodeEditor
                        setlanguage={setrunlang}
                        setruncode= {setruncode}
                        
                    />
                    <div className='flex gap-20 justify-end'>
                    <button className=' bg-slate-900 text-white p-3 rounded-md' onClick={handleRun}>Run</button>
                    <button className='bg-slate-900 text-white p-3 rounded-md' >Submit</button>
                    </div>
                    </div>
                    
                    
                    
                  </div>
                )
                }
            
            
            })
        ):(
            <>loading...</>
        )

        }
    </>
  )
}

