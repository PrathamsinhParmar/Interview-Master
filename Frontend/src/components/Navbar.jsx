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

    // Add scrolled state for subtle background changes when scrolled
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '#about' },
        { label: 'Testimonials', path: '/testimonials' },
        { label: 'Contact', path: '#contact' }
    ];

    return (
        <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
            <nav className="glass-navbar">
                <div className="navbar-brand" onClick={() => navigate('/')}>
                    <span className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </span>
                    <span className="brand-name">Interview <span className="highlight">Master</span></span>
                </div>

                <div className="navbar-links desktop-only">
                    {navLinks.map((link, index) => (
                        <a 
                            key={index} 
                            href={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={(e) => {
                                if (link.path.startsWith('/')) {
                                    e.preventDefault();
                                    navigate(link.path);
                                }
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="navbar-actions desktop-only">
                    {user && <span className="user-name">Hello, <strong>{user.username}</strong></span>}
                    <button className="logout-cta" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                        Logout
                    </button>
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

                {/* Mobile Menu Overlay */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-links">
                        {navLinks.map((link, index) => (
                            <a 
                                key={index} 
                                href={link.path}
                                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={(e) => {
                                    if (link.path.startsWith('/')) {
                                        e.preventDefault();
                                        navigate(link.path);
                                    }
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="mobile-actions">
                        {user && <span className="mobile-user-name">Hello, <strong>{user.username}</strong></span>}
                        <button className="mobile-logout-cta" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
