
import { useClerk, useUser } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";
export default function NavbarElements({setlogout}){
    
    const { signOut } = useClerk();

    const elements= [
        {   
            index: 1,
            namelink: "About",
            source:"/about"
        },{
            index: 2,
            namelink: "Problems",
            source:"/problems"
        },{
            index: 3,
            namelink: "LeaderBoard",
            source:"/leaderboard"  
        },
      
         
      

    ]
    const { isSignedIn, user, isLoaded } = useUser();
    return(
        <>
        <div className="pt-10 pb-4">
        <ul className="flex text-white gap-10">

       { elements.map((el)=>{

        return (
            <>
            <button key={el.index}><Link to = {el.source}>{el.namelink}</Link></button>
            </> )
           
                     }
                    )
       }
       
       {!isSignedIn?
         (<button key="login"><Link to = "/login">Login</Link></button>):
         (<button key="logout" onClick={() =>{ 
           
            signOut(() => router.push("/"))
         

        }
        }>Logout</button>)
    
    }
    </ul>
    </div>
        </>
    )
}
