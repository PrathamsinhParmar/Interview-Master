import React from 'react';
import Navbar from '../../../components/Navbar.jsx';
import AnimatedCardDemo from '../../../components/AnimatedCard.jsx';
import Footer from '../../../components/Footer.jsx';
import '../styles/about.scss';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-bg">
                <div className="bg-orb bg-orb--1"></div>
                <div className="bg-orb bg-orb--2"></div>
                <div className="bg-orb bg-orb--3"></div>
            </div>
            <Navbar />

            <main className="about-content">
                
                {/* Hero Section: Mission & Vision */}
                <section className="hero-section">
                    <h1 className="hero-section__title">
                        Empowering careers through <span>intelligent</span> preparation.
                    </h1>
                    <p className="hero-section__text">
                        <strong>Our Mission:</strong> To democratize access to elite interview coaching by leveraging advanced artificial intelligence, leveling the playing field for candidates of all backgrounds.
                    </p>
                    <p className="hero-section__text mt-4">
                        <strong>Our Vision:</strong> A world where hiring is based purely on merit and capability, unclouded by interview anxiety or a lack of insider knowledge.
                    </p>
                </section>

                {/* Story Section */}
                <section className="story-section">
                    <div className="story-section__col">
                        <h2 className="section-heading">Our Philosophy</h2>
                        <p>
                            We don't believe in memorizing generic answers to generic questions. Every role is different, and every candidate has a unique background.
                        </p>
                        <p>
                            Our goal is to help you connect the dots between your past experiences and the specific requirements of the role you're applying for, so you can walk into your interview feeling prepared, grounded, and <strong>authentic.</strong>
                        </p>
                    </div>
                    <div className="story-section__col story-section__col--visual">
                        <AnimatedCardDemo />
                    </div>
                </section>

                {/* Technical Description & How It Works */}
                <section className="workflow-section">
                    <h2 className="section-heading text-center">Technical Architecture: How It Works</h2>
                    
                    <div className="workflow-steps">
                        <div className="workflow-step">
                            <span className="workflow-step__number">01</span>
                            <div className="workflow-step__content">
                                <h3>Data Ingestion & Contextualization</h3>
                                <p>
                                    You provide the job description and your resume. Our system uses advanced Natural Language Processing (NLP) to parse unstructured text, extracting core competencies, domain-specific terminology, and soft skills required by the employer.
                                </p>
                            </div>
                        </div>
                        
                        <div className="workflow-step">
                            <span className="workflow-step__number">02</span>
                            <div className="workflow-step__content">
                                <h3>Semantic Matching & Gap Analysis</h3>
                                <p>
                                    Using vector embeddings and a fine-tuned Large Language Model (LLM), the platform analyzes the semantic distance between your experience and the job's requirements. It identifies high-overlap areas to highlight, and pinpoints experience gaps that you will likely be asked to defend.
                                </p>
                            </div>
                        </div>
                        
                        <div className="workflow-step">
                            <span className="workflow-step__number">03</span>
                            <div className="workflow-step__content">
                                <h3>Dynamic Strategy Generation</h3>
                                <p>
                                    The engine generates a tailored, high-probability question set along with strategic talking points. This utilizes a Retrieval-Augmented Generation (RAG) pipeline to cross-reference historical interview data with your specific profile.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack & Infrastructure */}
                <section className="tech-stack-section">
                    <h2 className="section-heading text-center">Technology Stack & Infrastructure</h2>
                    <div className="tech-grid">
                        <div className="tech-card">
                            <h4>Frontend: React Ecosystem</h4>
                            <p>Built as a single-page application (SPA) using React and Vite for lightning-fast HMR and optimized production builds. State management is streamlined for highly responsive, interactive UI components.</p>
                        </div>
                        <div className="tech-card">
                            <h4>Backend: Node.js & Express</h4>
                            <p>A scalable RESTful API architecture running on Node.js. It handles asynchronous job processing, secure user authentication, and coordinates requests to external AI microservices.</p>
                        </div>
                        <div className="tech-card">
                            <h4>Database: MongoDB</h4>
                            <p>A NoSQL data layer utilizing MongoDB to flexibly store unstructured user profiles, historical interview sessions, and generated feedback reports for continuous model tuning.</p>
                        </div>
                        <div className="tech-card">
                            <h4>AI & NLP Engine</h4>
                            <p>Powered by state-of-the-art Large Language Models (LLMs). We utilize sophisticated prompt engineering and context-window optimization to ensure highly accurate, hallucination-free coaching.</p>
                        </div>
                    </div>
                </section>

                {/* Capabilities & Methodology */}
                <section className="story-section">
                    <div className="story-section__col">
                        <h2 className="section-heading">Key Capabilities</h2>
                        <ul className="feature-list">
                            <li><strong>Resume Parsing Engine:</strong> Extracts structured data from PDF/DOCX formats with precise data recognition.</li>
                            <li><strong>Predictive Question Modeling:</strong> Anticipates technical and behavioral questions based on employer patterns.</li>
                            <li><strong>Real-time Feedback Loop:</strong> Evaluates user responses against STAR (Situation, Task, Action, Result) methodology.</li>
                        </ul>
                    </div>
                    <div className="story-section__col">
                        <h2 className="section-heading">Methodology & QA</h2>
                        <ul className="feature-list">
                            <li><strong>Agile Development:</strong> Continuous iteration with bi-weekly sprint cycles ensuring rapid feature deployment.</li>
                            <li><strong>Data Privacy:</strong> Strict PII stripping algorithms run before any data is sent to external LLM providers.</li>
                            <li><strong>Automated Testing:</strong> Comprehensive CI/CD pipelines with rigorous unit and integration testing.</li>
                        </ul>
                    </div>
                </section>

                {/* Team & Milestones */}
                <section className="milestones-section text-center">
                    <h2 className="section-heading">Team Expertise & Milestones</h2>
                    <p className="milestones-section__desc">
                        Nexviva is engineered by a specialized team of full-stack developers, AI researchers, and former technical recruiters. We bridge the gap between complex machine learning architectures and intuitive UX design.
                    </p>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">v2.0</span>
                            <span className="stat-label">Core Engine Live</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime SLA</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">ISO</span>
                            <span className="stat-label">Security Standards Compliant</span>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default About;
