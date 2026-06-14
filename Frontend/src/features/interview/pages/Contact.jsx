import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../components/Navbar.jsx';
import GlobePulse from '../../../components/GlobePulse.jsx';
import Footer from '../../../components/Footer.jsx';
import '../styles/contact.scss';

const countries = [
    { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
    { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
    { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
    { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
    { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
    { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
    { name: 'South Korea', code: 'KR', dial: '+82', flag: '🇰🇷' },
    { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
    { name: 'UAE', code: 'AE', dial: '+971', flag: '🇦🇪' },
    { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
    { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
    { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
    { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
    { name: 'Russia', code: 'RU', dial: '+7', flag: '🇷🇺' },
    { name: 'Mexico', code: 'MX', dial: '+52', flag: '🇲🇽' },
    { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
    { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
    { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
    { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
    { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
    { name: 'Thailand', code: 'TH', dial: '+66', flag: '🇹🇭' },
    { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
    { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
    { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
    { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
    { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [privacyAccepted, setPrivacyAccepted] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dial.includes(searchQuery) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'message' && value.length > 300) return;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!privacyAccepted) {
            setSubmitStatus('error');
            setSubmitMessage('Please accept the privacy policy.');
            return;
        }

        if (!formData.name || !formData.email || !formData.message) {
            setSubmitStatus('error');
            setSubmitMessage('Please fill in all required fields (Name, Email, Message).');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage('');

        try {
            const response = await axios.post('http://localhost:3000/api/contact/submit', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone ? `${selectedCountry.dial} ${formData.phone}` : undefined,
                message: formData.message
            });

            if (response.data.success) {
                setSubmitStatus('success');
                setSubmitMessage(response.data.message || 'Your message has been sent successfully.');
                setFormData({ name: '', email: '', phone: '', message: '' });
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage(error.response?.data?.message || 'An error occurred while sending your message.');
        } finally {
            setIsSubmitting(false);
        }
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
                        Or just reach out manually to <a href="mailto:prathamgj2@gmail.com">prathamgj2@gmail.com</a>
                    </p>
                    <div className="contact-info__globe">
                        <GlobePulse />
                    </div>
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
                            <div className="phone-prefix" ref={dropdownRef}>
                                <div className="phone-prefix__selected" onClick={() => setShowDropdown(!showDropdown)}>
                                    <span className="flag">{selectedCountry.flag}</span>
                                    <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    <span className="code">{selectedCountry.dial}</span>
                                </div>

                                {showDropdown && (
                                    <div className="phone-dropdown">
                                        <div className="phone-dropdown__search">
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <ul className="phone-dropdown__list">
                                            {filteredCountries.map(c => (
                                                <li
                                                    key={c.code}
                                                    className={`phone-dropdown__item ${c.code === selectedCountry.code ? 'phone-dropdown__item--active' : ''}`}
                                                    onClick={() => {
                                                        setSelectedCountry(c);
                                                        setShowDropdown(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <span className="phone-dropdown__flag">{c.flag}</span>
                                                    <span className="phone-dropdown__name">{c.name}</span>
                                                    <span className="phone-dropdown__dial">{c.dial}</span>
                                                </li>
                                            ))}
                                            {filteredCountries.length === 0 && (
                                                <li className="phone-dropdown__empty">No results found</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
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

                    {submitMessage && (
                        <div className={`submit-message ${submitStatus === 'success' ? 'submit-message--success' : 'submit-message--error'}`} style={{ padding: '10px', borderRadius: '5px', marginTop: '10px', marginBottom: '10px', backgroundColor: submitStatus === 'success' ? '#10b98122' : '#ef444422', color: submitStatus === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${submitStatus === 'success' ? '#10b981' : '#ef4444'}` }}>
                            {submitMessage}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                        {isSubmitting ? 'Sending...' : 'Submit Form'} {!isSubmitting && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
