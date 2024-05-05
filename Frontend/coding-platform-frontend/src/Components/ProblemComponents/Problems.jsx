import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


export default function Problems() {
    const[loading,setLoading] = useState(false);
    const[problemdata, setproblemdata] = useState([]);
    useEffect(()=>{
        setLoading(true);
        fetch("http://localhost:5001/api/problem")
        .then(response => response.json())
        .then((data)=>{
           
            setproblemdata(data)
            setLoading(false);
           
        })
    },[])
  return (
    <div className="  mt-15 w-[60.4em] h-[40em] rounded-lg problem-flex-container">
    <ul className="flex flex-col mt-8 ml-20 gap-8" >
    {
    !loading ? (
        problemdata.map((item , index)=>{
        return( 
        <>
        <div key={index}>
            <Link to = {`/problems/${index+"$"+ item.title +"$"+item._id}`}>
            <button>{item.title.toUpperCase()}</button>
            </Link>
            </div>
                    <hr className="mt-4 w-[40em]"></hr>
                    </>
    );
    })
       
    ):(
        <>loading...</>
    )

    }
    </ul>
    </div>
  )
}

 