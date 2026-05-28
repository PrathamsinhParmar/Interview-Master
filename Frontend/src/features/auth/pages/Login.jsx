import React, {useState} from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const nevigate = useNavigate()

    const { loading, handleLogin } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e)=>{
        e.preventDefault()
        await handleLogin({email, password})
        nevigate('/')
    }

    if(loading){
        return (
            <main>
                <h1>Loading...</h1>
            </main>
        )
    }

  return (
    <div>
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" placeholder='Enter your email'
                            onChange={(e)=>{
                                setEmail(e.target.value)
                            }}/>    
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder='Enter password'
                            onChange={(e)=>{
                                setPassword(e.target.value)
                            }}/>
                    </div>

                    <button> 
                        <div className="button primary-button">
                            Login
                        </div>
                    </button>
                </form>

                <p>Don't have an account? <Link to={'/register'}>Register</Link></p>
            </div>
        </main>
    </div>
  )
}

export default Login
