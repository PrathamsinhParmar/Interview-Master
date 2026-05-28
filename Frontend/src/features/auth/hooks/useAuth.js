import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { loginUser, registerUser, logoutUser, getUserData } from "../services/auth.api";

// Create a hook
export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({email, password})=>{
        setLoading(true)
        try {
            const data = await loginUser({email, password})
            setUser(data.user)
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
            
    }

    const handleRegister = async ({username, email, password})=>{
        setLoading(true)
        try {
            const data = await registerUser({username, email, password})
            setUser(data.user)
        } catch (error) {
            
        } finally{
            setLoading(false)
        }    
    }

    const handleLogout = async ()=>{
        setLoading(true)
        try {
            const data = await logoutUser()
            setUser(null)
        } catch (error) {
            
        } finally{
            setLoading(false)
        }       
    }

    useEffect(()=>{
        const getAndSetUser = async ()=>{
            const data = await getUserData()
            setUser(data.user)
            setLoading(false)
        }
        
        getAndSetUser()
    }, [])


    return { user, loading, handleLogin, handleRegister, handleLogout }
}