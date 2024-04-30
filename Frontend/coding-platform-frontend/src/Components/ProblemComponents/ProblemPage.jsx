import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


import CodeEditor from './CodeEditor';

export default function ProblemPage() {
    const { userId, isLoaded } = useAuth()
    const navigate = useNavigate()

    

    React.useEffect(() => {
        if (isLoaded && !userId) {
            navigate("/login")
        }
    }, [isLoaded])

    if (!isLoaded) {
        window.location.href= '/'
        return;
    }
    const[title , settitle] = useState(useParams().id.substring(2,));
    const [probdata , setprobdata] = useState([]);
    const[loading, setLoading] = useState(false);
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
                   <div className=' flex justify-center'>
                    <CodeEditor/>
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

