import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


import CodeEditor from './CodeEditor';

export default function ProblemPage() {
    const { getToken } = useAuth();

    const mapformat ={
        "python":"py",
        "java":"java",
        "javascript":"js",
        "c++":"cpp",
        
    }


    const[runcode, setruncode] = useState("");
    const[runlang , setrunlang] = useState("");
    const[data, setdata] = useState(null);
    const[title , settitle] = useState(useParams().id.substring(2,));
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
           })
           const data = await response.json();
            console.log(data);
            setdata(data);
            
        }catch(e){
            console.error('Error:', error);
        }
        
        try{
            await fetch(`http://localhost:5001/api/code/submissions/${data.requestId}`)
            .then((response) => response.json())
            .then((data)=>{
                setdata(data)
            })
        }
        catch(e){
            throw new Error("the code execution failed!")
        }
    }
    //handle submission code
 async   function handleSubmit(){
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
       })
       const data = await response.json();
        console.log(data);
        setdata(data);
        
    }catch(e){
        console.error('Error:', error);
    }
    
    try{
        await fetch(`http://localhost:5001/api/code/submissions/${data.requestId}`)
        .then((response) => response.json())
        .then((data)=>{
            setdata(data)
        })
        if(data.status === 'accepted'){
            //handle submission code here
            try{

            }
            catch(e){
                console.log("The error occured when saving to db");
            }
        }
    }
    catch(e){
        throw new Error("the code execution at submission failed!")
    }

    }
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
                    <button className='bg-slate-900 text-white p-3 rounded-md' onClick={handleSubmit}>Submit</button>
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

