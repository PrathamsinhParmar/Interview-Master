import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function registerUser({username, email, password}){
    try {

        const response = await api.post("/api/auth/register", {
            username,
            email,
            password
        })

        return response.data

    } catch (error) {
        console.log("Error: ", error)
    }
}

export async function loginUser({ username, email, password }){

    try {
        
        const response = await api.post("/api/auth/login", {
            username, 
            email,
            password
        })

        return response.data

    } catch (error) {
        console.log("Error: ", error)
    }
}


export async function logoutUser(){
    try {
        
        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (error) {
        console.log("Error: ",error)
    }
}



export async function getUserData(){
    try {
        const response = await api.get("/api/auth/get-me")

        return response.data
    } catch (error) {
        console.log("Error: ",error)
    }
}