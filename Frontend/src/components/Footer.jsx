import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="professional-footer">
            {/* Ambient Animated Effect */}
            <div className="footer-glow-effect"></div>

            {/* Floating Orbs Background Effects */}
            <div className="footer-bg-orbs">
                <div className="footer-orb footer-orb--1"></div>
                <div className="footer-orb footer-orb--2"></div>
                <div className="footer-orb footer-orb--3"></div>
            </div>
            
            <div className="footer-content">
                <div className="footer-info">
                    <div className="footer-logo">
                        <img src="/Nexviva Logo.png" alt="Nexviva" className="footer-brand-logo" />
                    </div>
                    <p className="footer-description">
                        Empowering candidates with AI-driven interview strategies and tailored insights. Build your confidence and land your dream job with precision.
                    </p>
                    <div className="footer-tags">
                        <span className="tag">AI-Powered</span>
                        <span className="tag">Resume Analysis</span>
                        <span className="tag">Career Growth</span>
                        <span className="tag">Tech Jobs</span>
                    </div>
                </div>

                <div className="footer-right">
                    <div className="footer-contact">
                        <h3 className="footer-heading">Contact Information</h3>
                        <ul className="info-list">
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <a href="mailto:prathamsinhparmar0@gmail.com" className="contact-link">prathamsinhparmar0@gmail.com</a>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <a href="https://maps.google.com/?q=Vadodara,Gujarat,India" target="_blank" rel="noopener noreferrer" className="contact-link">Vadoadara, Gujarat, India</a>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <a href="tel:+918238075291" className="contact-link">+91 8238075291</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h3 className="footer-heading">Connect With Us</h3>
                        <div className="social-icons">
                            <a href="https://github.com/PrathamsinhParmar" aria-label="Twitter" className="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/prathamsinhparmar-2162a2300/" aria-label="LinkedIn" className="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="https://github.com/PrathamsinhParmar" aria-label="GitHub" className="social-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Nexviva. All rights reserved. Built for ambition.</p>
            </div>
        </footer>
    );
};

export default Footer;
