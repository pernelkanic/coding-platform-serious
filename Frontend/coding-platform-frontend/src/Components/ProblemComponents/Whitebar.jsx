import React from "react"
import Problems from "./Problems"


export const Whitebar=()=>{
    return (
        <>
        <div className="whitebarcontainer">
         <div className=" bg-zinc-50 shadow-lg   mt-10 w-[60.4em] h-[40em] rounded-lg problem-flex-container">
            <ul className="flex flex-col mt-8 ml-20 gap-8" >
            
                    <div  className="">
                        <h1 className=" text-center">ProblemSet</h1>
                        
                        <Problems/>
                     </div>
                   
              
            
            </ul>
        </div>
        </div>
        </>
    )
}