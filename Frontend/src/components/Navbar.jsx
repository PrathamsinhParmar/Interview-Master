import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import './Navbar.scss';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, handleLogout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogoutClick = async () => {
        await handleLogout();
        navigate('/landing');
    };

    // Add scrolled state for subtle background changes when scrolled
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Public links — accessible to everyone
    // Protected links (protected: true) — redirect to /login if not authenticated
    const navLinks = [
        { label: 'Home',           path: '/',               protected: true  },
        { label: 'Mock Interview', path: '/mock-interview',  protected: true  },
        { label: 'About',          path: '/about',           protected: false },
        { label: 'Testimonials',   path: '/testimonials',    protected: false },
        { label: 'Contact',        path: '/contact',         protected: false },
    ];

    const handleNavClick = (e, link) => {
        e.preventDefault();
        if (link.protected && !user) {
            navigate('/login');
        } else {
            navigate(link.path);
        }
    };

    return (
        <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
            <nav className="glass-navbar">
                <div className="navbar-brand" onClick={() => navigate('/landing')}>
                    <img
                        src="/Nexviva Logo.png"
                        alt="Nexviva"
                        className="brand-logo"
                    />
                </div>

                <div className="navbar-links desktop-only">
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''} ${link.protected ? 'nav-link--protected' : ''}`}
                            onClick={(e) => handleNavClick(e, link)}
                        >
                            {link.label}
                            {link.protected && (
                                <span className="nav-lock-icon" aria-label="Requires login">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                            )}
                        </a>
                    ))}
                </div>

                <div className="navbar-actions desktop-only">
                    {user ? (
                        <>
                            <span className="user-name">Hello, <strong>{user.username}</strong></span>
                            <button className="logout-cta" onClick={handleLogoutClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button id="navbar-login-btn" className="login-cta" onClick={() => navigate('/login')}>
                                Login
                            </button>
                            <button id="navbar-register-btn" className="register-cta" onClick={() => navigate('/register')}>
                                Get Started
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    className={`hamburger-toggle mobile-only ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

            </nav>

            {/* Mobile Menu Overlay for Click-Outside-to-Close */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''} mobile-only`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Mobile Menu Drawer */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <button
                    className="mobile-close-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="mobile-links">
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.path}
                            className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, link)}
                        >
                            {link.label}
                            {link.protected && !user && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: '0.4rem' }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            )}
                        </a>
                    ))}
                </div>

                <div className="mobile-actions">
                    {user ? (
                        <>
                            <span className="mobile-user-name">Hello, <strong>{user.username}</strong></span>
                            <button className="mobile-logout-cta" onClick={handleLogoutClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button id="mobile-login-btn" className="mobile-login-cta" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                                Login
                            </button>
                            <button id="mobile-register-btn" className="mobile-register-cta" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>
                                Get Started
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
