import React, {useState} from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader'
import Footer from '../../../components/Footer.jsx'

const Login = () => {

    const navigate = useNavigate()
    const { loading, handleLogin } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrorMsg("")
        const res = await handleLogin({email, password})
        if (res && !res.success) {
            setErrorMsg(res.error)
        } else {
            navigate('/')
        }
    }

    if(loading){
        return (
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
                <h1>Welcome back</h1>
                <p>Please enter your details to sign in.</p>
            </div>

            {errorMsg && <div style={{color: '#e03232', marginBottom: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '500'}}>{errorMsg}</div>}

            {/* Social Providers */}
            <div className="social-providers">
                <button type="button" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.498 10.4578C15.4674 8.78917 16.8532 7.96208 16.9208 7.92082C16.1437 6.78652 14.8878 6.60338 14.4533 6.58661C13.435 6.48427 12.4411 7.18652 11.9168 7.18652C11.3916 7.18652 10.5732 6.6025 9.72124 6.62125C8.6186 6.63661 7.59253 7.26251 7.02509 8.24584C5.86794 10.2525 6.73231 13.2163 7.86016 14.8463C8.41165 15.643 9.06649 16.5383 9.94639 16.505C10.7951 16.4733 11.1147 15.9625 12.1156 15.9625C13.1165 15.9625 13.4045 16.505 14.2882 16.4883C15.2018 16.4733 15.765 15.6608 16.3116 14.8625C16.9452 13.9375 17.206 13.0333 17.2205 12.9817C17.2023 12.9733 15.5342 12.3383 15.498 10.4578ZM13.8821 5.37874C14.3484 4.81458 14.6612 4.02708 14.5765 3.23874C13.8967 3.26624 13.0805 3.69124 12.597 4.25458C12.1625 4.75708 11.785 5.55874 11.8887 6.33208C12.6515 6.39124 13.4143 5.94291 13.8821 5.37874Z"/>
                    </svg>
                </button>
                <button type="button" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.14 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                </button>
                <button type="button" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.953 4.57009C23.0545 4.96569 22.0762 5.23126 21.0394 5.35338C22.0954 4.72147 22.9064 3.7196 23.2872 2.53177C22.3197 3.10545 21.246 3.51866 20.0964 3.73715C19.1837 2.76633 17.8824 2.15039 16.4258 2.15039C13.6309 2.15039 11.3644 4.41689 11.3644 7.21184C11.3644 7.60803 11.4092 7.99465 11.4965 8.36709C7.29177 8.15617 3.54145 6.14324 1.0541 3.10912C0.618698 3.85693 0.36868 4.72314 0.36868 5.64299C0.36868 7.3986 1.26251 8.95107 2.62002 9.8582C1.7997 9.83226 1.02674 9.60682 0.334053 9.2263V9.28945C0.334053 11.7346 2.0736 13.7749 4.38573 14.2384C3.96096 14.3541 3.5147 14.4149 3.05466 14.4149C2.72852 14.4149 2.4116 14.3832 2.10237 14.3245C2.74415 16.3297 4.60975 17.7888 6.81832 17.8296C5.09069 19.1837 2.90998 19.995 0.548777 19.995C0.140228 19.995 -0.263596 19.9712 -0.663189 19.9231C1.56455 21.352 4.25419 22.1818 7.14304 22.1818C16.5056 22.1818 21.6242 14.4239 21.6242 7.69085C21.6242 7.47047 21.6193 7.2515 21.6096 7.03456C22.6041 6.31613 23.4691 5.48554 24.1165 4.5447V4.57009Z"/>
                    </svg>
                </button>
            </div>

            {/* Divider */}
            <div className="divider">
                <span>OR</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email">E-Mail Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email..." 
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

                {/* Remember & Forgot Password */}
                <div className="form-actions-row">
                    <label className="remember-me">
                        <input type="checkbox" name="remember" />
                        <span className="checkmark"></span>
                        <span className="label-text">Remember me</span>
                    </label>
                    <Link to="#" className="forgot-password">Forgot password?</Link>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">Sign in</button>
            </form>

            {/* Footer Link */}
            <div className="card-footer">
                <p>Don't have an account yet? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Login
