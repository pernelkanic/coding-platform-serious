import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProblemPage() {
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

