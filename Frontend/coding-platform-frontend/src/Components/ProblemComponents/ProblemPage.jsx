import { useAuth } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import AceEditor from "react-ace";
import { useNavigate, useParams } from 'react-router-dom';

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

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
                   <div className=' flex justify-center mt-40 mb-10'>
                    <AceEditor
                        height="600px"
                        width='1000px'
                        mode="java"
                        theme="monokai"
                        fontSize="16px"
                        highlightActiveLine={true}
                        setOptions={{
                            enableLiveAutocompletion: true,
                            showLineNumbers: true,
                            tabSize: 2,
                            }}

                            />
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

