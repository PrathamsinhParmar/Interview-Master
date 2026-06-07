import React, {useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader'
import Footer from '../../../components/Footer.jsx'

const Register = () => {

    const navigate = useNavigate()
    
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const {loading, handleRegister} = useAuth()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrorMsg("")
        const res = await handleRegister({ username, email, password })
        if (res && !res.success) {
            setErrorMsg(res.error)
        } else {
            navigate('/login')
        }
    }

    if(loading){
        return(
            <main className="login-container">
                <Loader variant="circle" />
            </main>
        )
    }

  return (
    <div className="login-container">
        <div className="login-card">
            {/* Decorative background elements */}
            <div className="card-bg-grid"></div>
            <div className="card-bg-glow"></div>

            {/* Logo */}
            <div className="logo-container">
                <div className="logo">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8C4 8 7 5 12 8C17 11 20 8 20 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 12C4 12 7 9 12 12C17 15 20 12 20 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 16C4 16 7 13 12 16C17 19 20 16 20 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>

            {/* Header */}
            <div className="header">
                <h1>Create an account</h1>
                <p>Please enter your details to sign up.</p>
            </div>

            {errorMsg && <div style={{color: '#e03232', marginBottom: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '500'}}>{errorMsg}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
                {/* Username Field */}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Enter your username" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email">E-Mail Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            placeholder="••••••••" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button" 
                            className="toggle-password" 
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3L21 21M9.87871 9.87866C8.80218 10.3242 8 11.3787 8 12.6364C8 14.2933 9.34315 15.6364 11 15.6364C12.2577 15.6364 13.3122 14.8342 13.7577 13.7577M21.2533 12.0001C19.7891 15.867 16.1437 18.6364 12 18.6364C10.7481 18.6364 9.55393 18.3582 8.46875 17.8643M15.5312 6.13568C14.4461 5.64183 13.2519 5.36365 12 5.36365C7.8563 5.36365 4.21094 8.1331 2.74668 12.0001C3.12579 13.0039 3.65961 13.9212 4.31641 14.7335M18.8465 7.85627C19.756 8.92211 20.536 10.1347 21.2533 12.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn" style={{marginTop: '10px'}}>Register</button>
            </form>

            {/* Footer Link */}
            <div className="card-footer">
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Register
