import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
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
            return { success: true }
        } catch (error) {
            return { success: false, error }
        }finally{
            setLoading(false)
        }
            
    }

    const handleRegister = async ({username, email, password})=>{
        setLoading(true)
        try {
            const data = await registerUser({username, email, password})
            setUser(data.user)
            return { success: true }
        } catch (error) {
            return { success: false, error } 
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


    return { user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout }
}