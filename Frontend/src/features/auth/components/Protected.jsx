import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {

    const { loading, user } = useAuth()

    if(loading){
        return(
            <main style={{background: '#130f0f', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h1>Loading Authentication...</h1>
            </main>
        )
    }

    if(!user){
        return <Navigate to={'/login'}/>
    }


  return children
}

export default Protected
