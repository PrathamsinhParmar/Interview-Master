import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'
import { useSpeech } from '../../../hooks/useSpeech.js'
import { startMockInterview, sendMockInterviewMessage } from '../services/mockInterview.api.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import AILoader from '../components/AILoader.jsx'
import '../styles/mockInterview.scss'

// ── Constants ─────────────────────────────────────────────────────────────────
const EXPERIENCE_LEVELS = ['Internship', 'Junior', 'Mid', 'Senior', 'Lead']
const INTERVIEW_FOCUSES  = ['Technical', 'Behavioral', 'Mixed']

// ── Helpers ───────────────────────────────────────────────────────────────────
const getScoreClass = (s) => s >= 75 ? 'high' : s >= 50 ? 'mid' : 'low'

// ── Sub-components ────────────────────────────────────────────────────────────

/** Mic icon SVG */
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
)

/** Stop icon SVG */
const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
)

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
)

const CameraOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
)

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z"></path>
    </svg>
)

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
)

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
    const [jobRole, setJobRole]             = useState('')
    const [experienceLevel, setExpLevel]    = useState('Mid')
    const [interviewFocus, setFocus]        = useState('Mixed')
    const [resumeFile, setResumeFile]       = useState(null)
    const [loading, setLoading]             = useState(false)
    const [error, setError]                 = useState('')
    const fileRef = useRef()

    const handleStart = async () => {
        setError('')
        if (!jobRole.trim()) {
            setError('Please enter your target job role.')
            return
        }
        setLoading(true)
        try {
            const data = await startMockInterview({ jobRole, experienceLevel, interviewFocus, resumeFile })
            onStart(data)
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to start the interview. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mock-setup">
            <div className="mock-setup__header">
                <h1>Quick Start Your <span className="highlight">Mock Interview</span></h1>
                <p>Your personal AI interviewer is ready. Set up your session and practice like it's the real thing.</p>
            </div>

            {error && <div className="mock-setup__error">{error}</div>}

            <div className="mock-setup__card">

                {/* Job Role */}
                <div className="mock-setup__field">
                    <label>
                        Target Job Role
                        <span className="required">Required</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                        value={jobRole}
                        onChange={e => setJobRole(e.target.value)}
                    />
                </div>

                {/* Experience & Focus */}
                <div className="mock-setup__row">
                    <div className="mock-setup__field">
                        <label>Experience Level</label>
                        <select value={experienceLevel} onChange={e => setExpLevel(e.target.value)}>
                            {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="mock-setup__field">
                        <label>Interview Focus</label>
                        <select value={interviewFocus} onChange={e => setFocus(e.target.value)}>
                            {INTERVIEW_FOCUSES.map(f => <option key={f}>{f}</option>)}
                        </select>
                    </div>
                </div>

                {/* Resume Upload */}
                <div className="mock-setup__field">
                    <label>
                        Upload Resume (PDF)
                        <span className="mock-setup__optional-tag">Optional but recommended</span>
                    </label>
                    <label
                        className={`mock-setup__dropzone ${resumeFile ? 'has-file' : ''}`}
                        htmlFor="mock-resume-upload"
                    >
                        {resumeFile ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                </svg>
                                <p className="dz-title">{resumeFile.name}</p>
                                <p className="dz-sub">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                                </svg>
                                <p className="dz-title">Click to upload or drag & drop</p>
                                <p className="dz-sub">PDF only · Max 3MB</p>
                            </>
                        )}
                        <input
                            ref={fileRef}
                            id="mock-resume-upload"
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={e => setResumeFile(e.target.files?.[0] || null)}
                        />
                    </label>
                </div>

                {/* Start Button */}
                <button
                    className="mock-setup__start-btn"
                    onClick={handleStart}
                    disabled={loading}
                    id="start-mock-interview-btn"
                >
                    {loading ? (
                        <>
                            <div className="mock-setup__spinner" />
                            Connecting to Alex...
                        </>
                    ) : (
                        <>
                            🎙️ Start Interview with Alex
                        </>
                    )}
                </button>

            </div>
        </div>
    )
}

// ── Scorecard Screen ──────────────────────────────────────────────────────────
function ScorecardScreen({ scorecard, sessionData, onRetry, onHome }) {
    const { user } = useAuth();
    const score = scorecard?.overallScore ?? 0
    const jobRole = sessionData?.sessionMeta?.jobRole || 'Target Role'
    const userName = user?.username || 'Candidate'

    return (
        <div className="mock-scorecard">
            {/* Professional Report Header */}
            <div className="mock-scorecard__report-header">
                <div className="report-header-left">
                    <div className="report-title">
                        <h2>Performance Report</h2>
                        <p>Comprehensive assessment and feedback</p>
                    </div>
                    <div className="candidate-details">
                        <div className="detail-item">
                            <span className="detail-label">Candidate Name</span>
                            <span className="detail-value">{userName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Target Role</span>
                            <span className="detail-value">{jobRole}</span>
                        </div>
                    </div>
                </div>
                
                {/* Score Ring */}
                <div className="report-header-right">
                    <div className="mock-scorecard__score-ring">
                        <div className="ring" style={{ '--score': score }}>
                            <div className="ring-inner">
                                <span className="score-number">{score}</span>
                                <span className="score-label">/ 100</span>
                            </div>
                        </div>
                        {scorecard?.grade && (
                            <div className="grade-badge">{scorecard.grade}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Strengths */}
            {scorecard?.strengths?.length > 0 && (
                <div className="mock-scorecard__card">
                    <h3>Strengths</h3>
                    <div className="mock-scorecard__tags">
                        {scorecard.strengths.map((s, i) => (
                            <span key={i} className="tag tag--strength">{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Weaknesses */}
            {scorecard?.weaknesses?.length > 0 && (
                <div className="mock-scorecard__card">
                    <h3>Areas to Improve</h3>
                    <div className="mock-scorecard__tags">
                        {scorecard.weaknesses.map((w, i) => (
                            <span key={i} className="tag tag--weakness">{w}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Q&A Breakdown */}
            {scorecard?.questionBreakdown?.length > 0 && (
                <div className="mock-scorecard__card">
                    <h3>Question-by-Question Breakdown</h3>
                    <div className="mock-scorecard__breakdown">
                        {scorecard.questionBreakdown.map((item, i) => (
                            <div key={i} className="mock-scorecard__qa-item">
                                <div className="qa-header">
                                    <div className="qa-question">Q{i + 1}: {item.question}</div>
                                    <div className={`qa-score ${getScoreClass(item.score)}`}>{item.score}/100</div>
                                </div>
                                <div className="qa-row">
                                    <div className="qa-box">
                                        <div className="qa-box-label qa-box-label--yours">Your Answer</div>
                                        <div className="qa-box-text">{item.userAnswer || '(No answer recorded)'}</div>
                                    </div>
                                    <div className="qa-box">
                                        <div className="qa-box-label qa-box-label--ideal">Ideal Answer</div>
                                        <div className="qa-box-text">{item.idealAnswer}</div>
                                    </div>
                                </div>
                                {item.feedback && (
                                    <div className="qa-feedback">{item.feedback}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Overall Feedback */}
            {scorecard?.overallFeedback && (
                <div className="mock-scorecard__card">
                    <h3>Overall Feedback from Alex</h3>
                    <div className="mock-scorecard__overall-feedback">{scorecard.overallFeedback}</div>
                </div>
            )}

            {/* Actions */}
            <div className="mock-scorecard__actions">
                <button className="primary-action" onClick={onRetry} id="retry-mock-btn">
                    Try Again
                </button>
                <button className="secondary-action" onClick={onHome} id="home-from-scorecard-btn">
                    Back to Home
                </button>
            </div>
        </div>
    )
}

// ── Session Screen ────────────────────────────────────────────────────────────
function SessionScreen({ initialData, onFinish }) {
    const { speak, stopSpeaking, listen, stopListening, isListening, isSpeaking, speechSupported } = useSpeech()

    const [messages, setMessages]           = useState([])
    const [chatHistory, setChatHistory]     = useState([])
    const [sessionMeta, setSessionMeta]     = useState(null)
    const [aiTyping, setAiTyping]           = useState(false)
    const [questionCount, setQuestionCount] = useState(0)
    const [isCameraOn, setIsCameraOn]       = useState(true)
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    
    const videoRef = useRef(null)

    // Format timer
    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
        const s = (totalSeconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsElapsed(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Camera effect
    useEffect(() => {
        let stream = null;
        const setupCamera = async () => {
            if (isCameraOn) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { width: { ideal: 1920 }, height: { ideal: 1080 } } 
                    })
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream
                    }
                } catch (err) {
                    console.error("Failed to access webcam:", err)
                    setIsCameraOn(false)
                }
            } else {
                if (videoRef.current && videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks()
                    tracks.forEach(t => t.stop())
                    videoRef.current.srcObject = null
                }
            }
        }
        setupCamera()
        return () => {
            if (stream) {
                stream.getTracks().forEach(t => t.stop())
            }
        }
    }, [isCameraOn])

    // On mount: load the first AI message from the server and speak it
    useEffect(() => {
        if (!initialData) return

        const firstAiMsg = { role: 'ai', text: initialData.aiReply }
        setMessages([firstAiMsg])
        setChatHistory(initialData.updatedHistory || [])
        setSessionMeta(initialData.sessionMeta)
        setQuestionCount(1)

        // Speak the greeting after a short delay for voice loading
        setTimeout(() => speak(initialData.aiReply), 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /** Submit a user answer (text or transcribed voice) to the backend */
    const handleSendMessage = useCallback(async (text) => {
        if (!text.trim() || aiTyping) return

        stopSpeaking()

        const userMsg = { role: 'user', text: text.trim() }
        setMessages(prev => [...prev, userMsg])
        setAiTyping(true)

        try {
            const data = await sendMockInterviewMessage({
                userMessage: text.trim(),
                chatHistory,
                sessionMeta,
            })

            const aiMsg = { role: 'ai', text: data.aiReply }
            setMessages(prev => [...prev, aiMsg])
            setChatHistory(data.updatedHistory)
            setQuestionCount(prev => prev + 1)

            // Speak the AI's reply
            await speak(data.aiReply)

            // If interview is finished, pass scorecard up
            if (data.isFinished) {
                onFinish(data.scorecard)
            }
        } catch (err) {
            const friendlyMsg = err?.response?.data?.message
                || 'Sorry, I ran into an issue. Please wait a moment and try sending your answer again.'
            const errMsg = { role: 'ai', text: `⚠️ ${friendlyMsg}` }
            setMessages(prev => [...prev, errMsg])
        } finally {
            setAiTyping(false)
        }
    }, [aiTyping, chatHistory, sessionMeta, speak, stopSpeaking, onFinish])

    /** Handle mic button: start listening, then auto-submit the transcript */
    const handleMicClick = useCallback(async () => {
        if (isListening) {
            stopListening()
            return
        }
        if (aiTyping || isSpeaking) return

        try {
            const transcript = await listen()
            if (transcript) {
                await handleSendMessage(transcript)
            }
        } catch (err) {
            console.warn('Voice recognition error:', err.message)
        }
    }, [isListening, aiTyping, isSpeaking, listen, stopListening, handleSendMessage])

    /** Force end the interview early */
    const handleEndInterview = async () => {
        stopSpeaking()
        await handleSendMessage('end interview')
    }

    return (
        <div className="mock-session mock-session--split">
            {/* Top Bar */}
            <div className="mock-session__topbar">
                <div className="topbar-left">
                    <div className="mock-title">
                        <h2>Mock Interview</h2>
                        <span className="subtitle">{sessionMeta?.jobRole || 'Interview'}</span>
                    </div>
                </div>
                <div className="topbar-right">
                    <button className="finish-btn" onClick={handleEndInterview} disabled={aiTyping}>
                        Finish/Report
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="mock-session__main">
                <div className="main-header">
                    <h3>Question: {messages.filter(m => m.role === 'ai').pop()?.text || 'Listening...'}</h3>
                </div>

                <div className="video-layout">
                    {/* Left side: AI Avatar */}
                    <div className="video-pane pane-ai">
                        <AILoader speaking={isSpeaking} />
                        <div className="pane-label">Alex (AI)</div>
                    </div>

                    {/* Right side: User Webcam */}
                    <div className="video-pane pane-user">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className={`user-video ${!isCameraOn ? 'hidden' : ''}`}
                        ></video>
                        {!isCameraOn && (
                            <div className="camera-off-placeholder">
                                <div className="camera-off-icon"><CameraOffIcon /></div>
                            </div>
                        )}
                        <div className="pane-label">You</div>
                    </div>
                </div>

                {/* Control Bar */}
                <div className="control-bar">
                    <div className="control-timer">{formatTime(secondsElapsed)}</div>
                    <div className="control-buttons">
                        <button className="ctrl-btn" title="Volume">
                            <SpeakerIcon />
                        </button>
                        <button 
                            className={`ctrl-btn ${isListening ? 'active mic-active' : ''}`} 
                            onClick={handleMicClick}
                            disabled={aiTyping || isSpeaking || !speechSupported}
                            title={isListening ? 'Stop listening' : 'Click to speak'}
                        >
                            {isListening ? <StopIcon /> : <MicIcon />}
                        </button>
                        <button 
                            className="ctrl-btn btn-danger" 
                            onClick={handleEndInterview}
                            title="End Call"
                            disabled={aiTyping}
                        >
                            <PhoneIcon />
                        </button>
                        <button 
                            className={`ctrl-btn ${!isCameraOn ? 'inactive' : ''}`} 
                            onClick={() => setIsCameraOn(prev => !prev)}
                            title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                        >
                            {isCameraOn ? <CameraIcon /> : <CameraOffIcon />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const MockInterview = () => {
    // 'setup' | 'session' | 'scorecard'
    const [phase, setPhase]           = useState('setup')
    const [sessionData, setSessionData] = useState(null)
    const [scorecard, setScorecard]   = useState(null)
    const navigate = useNavigate()

    const handleSessionStart = (data) => {
        setSessionData(data)
        setPhase('session')
    }

    const handleInterviewFinish = (scorecardData) => {
        setScorecard(scorecardData)
        setPhase('scorecard')
    }

    const handleRetry = () => {
        setSessionData(null)
        setScorecard(null)
        setPhase('setup')
    }

    return (
        <div className="mock-interview-page">
            {/* Ambient Background */}
            <div className="ambient-background">
                <div className="glow-orb orb-1" />
                <div className="glow-orb orb-2" />
                <div className="glow-orb orb-3" />
            </div>

            {/* Navbar only on setup & scorecard — hide during live session for immersion */}
            {phase !== 'session' && <Navbar />}

            {phase === 'setup' && (
                <SetupScreen onStart={handleSessionStart} />
            )}

            {phase === 'session' && sessionData && (
                <SessionScreen
                    initialData={sessionData}
                    onFinish={handleInterviewFinish}
                />
            )}

            {phase === 'scorecard' && scorecard && (
                <ScorecardScreen
                    scorecard={scorecard}
                    sessionData={sessionData}
                    onRetry={handleRetry}
                    onHome={() => navigate('/')}
                />
            )}

            {/* Footer on setup & scorecard */}
            {phase !== 'session' && <Footer />}
        </div>
    )
}

export default MockInterview
