import { useAuth } from '@clerk/clerk-react';
import React from "react";
import { useNavigate } from 'react-router-dom';
import BlackBoxContainer from "../BlackBoxContainer";
import { Whitebar } from "./Whitebar";
export default function ProblemContainer(){
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
    return(
        <>

        <BlackBoxContainer/>
        <Whitebar/>
        </>
    )
}