import { createContext, useEffect, useState } from "react";
import { getUserData } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children })=>{

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // But in production, true

    useEffect(() => {
        getUserData()
            .then(data => {
                if (data && data.user) {
                    setUser(data.user)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return(
        <AuthContext.Provider value={ {user, setUser, loading, setLoading} }>
            { children }
        </AuthContext.Provider>
    )
}