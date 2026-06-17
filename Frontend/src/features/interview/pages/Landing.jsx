import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth.js';
import GlslHills from '../../../components/GlslHills.jsx';
import Navbar from '../../../components/Navbar.jsx';
import Footer from '../../../components/Footer.jsx';
import '../styles/landing.scss';

// ── Icon helpers ──────────────────────────────────────────────────────────────
const Icon = ({ children, size = 20 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </svg>
);

const BrainIcon    = () => <Icon><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></Icon>;
const FileIcon     = () => <Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>;
const MicIcon      = () => <Icon><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></Icon>;
const ZapIcon      = () => <Icon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const ArrowIcon    = () => <Icon><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>;
const CheckIcon    = () => <Icon size={16}><polyline points="20 6 9 17 4 12"/></Icon>;
const UsersIcon    = () => <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const StarIcon     = () => <Icon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
const TargetIcon   = () => <Icon><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Icon>;

// ── Feature Cards data ────────────────────────────────────────────────────────
const features = [
    {
        icon: <BrainIcon />,
        title: 'AI Interview Strategy',
        desc: 'Our AI analyzes the job description and your resume to craft a hyper-personalized interview plan — topics to study, questions to expect, and how to answer them.',
        tag: 'Powered by Gemini AI',
    },
    {
        icon: <FileIcon />,
        title: 'Resume Analysis',
        desc: 'Upload your PDF resume and get a match score against the job description. Understand your strengths and the exact gaps you need to address before walking in.',
        tag: 'Instant Analysis',
    },
    {
        icon: <MicIcon />,
        title: 'Live Mock Interviews',
        desc: 'Sit down with Alex, your AI interviewer. Answer real questions out loud, get scored in real time, and receive detailed feedback on confidence, content, and delivery.',
        tag: 'Live AI Feedback',
    },
];

// ── Steps data ────────────────────────────────────────────────────────────────
const steps = [
    { title: 'Paste the Job Description', desc: 'Copy the job posting and drop it in. Our AI instantly understands what the role demands.' },
    { title: 'Upload Your Resume or Profile', desc: 'Add your PDF resume or write a quick self-description to personalize your strategy.' },
    { title: 'Get Your Interview Plan', desc: 'In under 30 seconds, receive a full strategy: topics, questions, and model answers tailored to you.' },
    { title: 'Practice with Mock Interview', desc: 'Drill with Alex, our AI interviewer, until you can answer every question with confidence.' },
];

// ── Display Cards data ────────────────────────────────────────────────────────
const displayCardsData = [
    { icon: <BrainIcon />,   title: "Job Analysis",      desc: "Analyze job descriptions to uncover required skills and responsibilities in seconds.", date: "Step 1" },
    { icon: <FileIcon />,    title: "Resume Parsing",    desc: "Extract key details and align your profile with job positions.",   date: "Step 2" },
    { icon: <ZapIcon />,     title: "Strategy Plan",     desc: "Generate questions, roadmaps and personalized topics for focused preparation.",    date: "Step 3" },
    { icon: <MicIcon />,     title: "Mock Interview",    desc: "Experience realistic interview simulations powered by AI.",date: "Step 4" },
    { icon: <CheckIcon />,   title: "Detailed Feedback", desc: "Receive detailed evaluation matric and feedback to boost your interview skills.", date: "Step 5" },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
    { value: '5,000+',  label: 'Interviews Prepared' },
    { value: '98%',     label: 'Candidate Satisfaction' },
    { value: '<30s',    label: 'Strategy Generation' },
    { value: '3×',      label: 'Higher Offer Rate' },
];

// ─────────────────────────────────────────────────────────────────────────────
const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const gridRef = React.useRef(null);

    React.useEffect(() => {
        const syncPointer = (e) => {
            if (!gridRef.current) return;
            const x = e.clientX;
            const y = e.clientY;
            gridRef.current.style.setProperty('--x', x.toFixed(2));
            gridRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
            gridRef.current.style.setProperty('--y', y.toFixed(2));
            gridRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
        };

        document.addEventListener('pointermove', syncPointer);
        return () => document.removeEventListener('pointermove', syncPointer);
    }, []);

    const handleGetStarted = () => navigate(user ? '/' : '/register');
    const handleLearnMore  = () => navigate('/about');

    return (
        <div className="landing-page">

            {/* Ambient background orbs */}
            <div className="landing-ambient" aria-hidden="true">
                <div className="ambient-orb ambient-orb--1" />
                <div className="ambient-orb ambient-orb--2" />
                <div className="ambient-orb ambient-orb--3" />
            </div>

            {/* Navbar */}
            <Navbar />

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="hero-section" aria-label="Hero">

                {/* GLSL Hills canvas — self-positions absolutely to fill .hero-canvas-wrapper */}
                <div className="hero-canvas-wrapper" aria-hidden="true">
                    <GlslHills speed={0.45} cameraZ={125} planeSize={256} />
                </div>

                {/* Vignette overlay for readability */}
                <div className="hero-vignette" aria-hidden="true" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge__dot" />
                        AI-Powered Interview Preparation
                    </div>

                    <h1 className="hero-title">
                        Ace Every Interview<br />
                        with <span className="hero-title__accent">AI Precision</span>
                    </h1>

                    <p className="hero-subtitle">
                        Generate a hyper-personalized interview strategy from your resume and the job description — in under 30 seconds. Then practice with a live AI interviewer until you're ready.
                    </p>

                    <div className="hero-ctas">
                        <button
                            id="hero-get-started-btn"
                            className="hero-cta-primary"
                            onClick={handleGetStarted}
                        >
                            <ZapIcon />
                            {user ? 'Go to Dashboard' : 'Get Started Free'}
                        </button>
                        <button
                            id="hero-learn-more-btn"
                            className="hero-cta-secondary"
                            onClick={handleLearnMore}
                        >
                            Learn More
                            <ArrowIcon />
                        </button>
                    </div>
                </div>


            </section>

            {/* ── Features ──────────────────────────────────────────────────── */}
            <section className="landing-section features-section" aria-label="Features">
                <div className="features-header">
                    <span className="section-label">What You Get</span>
                    <h2 className="section-title">Everything You Need to Land the Job</h2>
                    <p className="section-subtitle">
                        From strategy generation to live practice — Nexviva covers every step of your interview journey.
                    </p>
                </div>

                <div className="features-grid" ref={gridRef}>
                    {features.map((f, i) => (
                        <div className="feature-card" data-glow key={i} id={`feature-card-${i}`}>
                            <div data-glow></div>
                            <div className="feature-card__content">
                                <h3 className="feature-card__title">{f.title}</h3>
                                <p className="feature-card__desc">{f.desc}</p>
                                <span className="feature-card__tag">
                                    <CheckIcon />
                                    {f.tag}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────────────────── */}
            <div className="how-section" aria-label="How It Works">
                <div className="how-inner">
                    <div className="how-left">
                        <span className="section-label">How It Works</span>
                        <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>
                            From Zero to Interview-Ready in Minutes
                        </h2>
                        <div className="how-steps">
                            {steps.map((step, i) => (
                                <div className="how-step" key={i} id={`how-step-${i}`}>
                                    <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                                    <div className="step-body">
                                        <h3>{step.title}</h3>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="how-visual" aria-hidden="true">
                        <div className="display-cards-container">
                            {displayCardsData.map((card, i) => (
                                <div className={`display-card card-${i}`} key={i}>
                                    <div className="card-header">
                                        <div className="card-icon">{card.icon}</div>
                                        <h4 className="card-title">{card.title}</h4>
                                    </div>
                                    <p className="card-desc">{card.desc}</p>
                                    <p className="card-date">{card.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────────── */}
            <section className="stats-section" aria-label="Statistics">
                <div className="stats-inner">
                    {stats.map((s, i) => (
                        <div className="stat-item" key={i} id={`stat-item-${i}`}>
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Final CTA ─────────────────────────────────────────────────── */}
            <section className="cta-section" aria-label="Call to Action">
                <div className="cta-inner">
                    <div className="cta-card">
                        <span className="cta-card__label">Start Today — It's Free</span>
                        <h2 className="cta-card__title">
                            Your Dream Job Is One<br />Interview Away
                        </h2>
                        <p className="cta-card__sub">
                            Join thousands of candidates who walked into their interviews fully prepared — and walked out with offers.
                        </p>
                        <div className="cta-card__actions">
                            <button
                                id="cta-get-started-btn"
                                className="hero-cta-primary"
                                onClick={handleGetStarted}
                            >
                                <ZapIcon />
                                {user ? 'Go to Dashboard' : 'Get Started Free'}
                            </button>
                            <button
                                id="cta-testimonials-btn"
                                className="hero-cta-secondary"
                                onClick={() => navigate('/testimonials')}
                            >
                                <UsersIcon />
                                Read Success Stories
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Landing;
