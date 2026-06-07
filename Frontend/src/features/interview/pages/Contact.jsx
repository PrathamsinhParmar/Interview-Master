import React, { useState } from 'react';
import Navbar from '../../../components/Navbar.jsx';
import '../styles/contact.scss';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [privacyAccepted, setPrivacyAccepted] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'message' && value.length > 300) return;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle submit
    };

    return (
        <div className="contact-page">
            <Navbar />
            
            {/* Ambient Background Glow */}
            <div className="contact-glow"></div>

            <main className="contact-layout">
                {/* Left Side: Info */}
                <section className="contact-info">
                    <div className="contact-info__badge">Contact Us</div>
                    <h1 className="contact-info__title">Let's Get In Touch.</h1>
                    <p className="contact-info__subtitle">
                        Or just reach out manually to <a href="mailto:hello@slothui.com">hello@slothui.com.</a>
                    </p>
                </section>

                {/* Right Side: Form */}
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="name">Full Name</label>
                        <div className="form-group__input-wrap">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                className="form-group__input" 
                                placeholder="Enter your full name..." 
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="email">Email Address</label>
                        <div className="form-group__input-wrap">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                className="form-group__input" 
                                placeholder="Enter your email address..." 
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="phone">Phone Number</label>
                        <div className="form-group__input-wrap form-group__input-wrap--phone">
                            <div className="phone-prefix">
                                <span className="flag">🇬🇧</span>
                                <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                <span className="code">+44</span>
                            </div>
                            <input 
                                type="text" 
                                id="phone" 
                                name="phone"
                                className="form-group__input" 
                                placeholder="(000) 000-0000" 
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            <svg className="help-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="message">Message</label>
                        <div className="form-group__textarea-wrap">
                            <textarea 
                                id="message" 
                                name="message"
                                className="form-group__textarea" 
                                placeholder="Enter your main text here..." 
                                value={formData.message}
                                onChange={handleInputChange}
                            ></textarea>
                            <div className="textarea-footer">
                                <span className="char-count">{(formData.message.length || 300).toString().padStart(3, '0')}/300</span>
                            </div>
                        </div>
                    </div>

                    <div className="privacy-check" onClick={() => setPrivacyAccepted(!privacyAccepted)}>
                        <div className={`privacy-check__box ${privacyAccepted ? 'privacy-check__box--checked' : ''}`}>
                            {privacyAccepted && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span className="privacy-check__text">
                            I hereby agree to our <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a> terms.
                        </span>
                    </div>

                    <button type="submit" className="submit-btn">
                        Submit Form <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </form>
            </main>
        </div>
    );
};

export default Contact;
