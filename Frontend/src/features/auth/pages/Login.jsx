import React from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'

const Login = () => {

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

  return (
    <div>
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Username or Email</label>
                            <input type="text" name="email" id="email" placeholder='Enter username or email'/>    
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" placeholder='Enter password'/>
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
