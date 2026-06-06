import React, { useEffect, useState } from 'react'
import './Loader.scss'

// ── AI spark icon (inline SVG) ────────────────────────────────────────────────
const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956Z" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

// ── Steps shown during AI report generation ───────────────────────────────────
const GENERATION_STEPS = [
    'Analyzing job description',
    'Mapping your profile to role',
    'Generating technical questions',
    'Generating behavioral questions',
    'Identifying skill gaps',
    'Building preparation roadmap',
]

/**
 * Loader component.
 *
 * Props:
 *  - variant: 'generate' | 'fetch'  (default 'fetch')
 *      'generate' → full AI generation screen with animated steps
 *      'fetch'    → simple spinner for data loading
 */
const Loader = ({ variant = 'fetch' }) => {
    const [activeStep, setActiveStep] = useState(0)

    // Advance steps automatically every ~4s for the generate variant
    useEffect(() => {
        if (variant !== 'generate') return
        const id = setInterval(() => {
            setActiveStep(prev => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev))
        }, 4000)
        return () => clearInterval(id)
    }, [variant])

    if (variant === 'circle') {
        return (
            <div className="loader-spinner">
                <div className="loader-particles">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="loader-particle" />
                    ))}
                </div>
                <div className="loader-ring loader-ring--outer" />
                <div className="loader-ring loader-ring--middle" />
                <div className="loader-ring loader-ring--inner" />
                <div className="loader-core">
                    <SparkIcon />
                </div>
            </div>
        )
    }

    const title    = variant === 'generate' ? 'Generating your plan…' : 'Loading…'
    const subtitle = variant === 'generate'
        ? 'Our AI is crafting a personalised strategy. This takes ~30 seconds.'
        : 'Fetching your data, hang tight.'

    return (
        <div className="loader-screen" aria-busy="true" aria-label={title}>

            {/* Ambient background orbs */}
            <div className="loader-orb loader-orb--1" />
            <div className="loader-orb loader-orb--2" />
            <div className="loader-orb loader-orb--3" />

            {/* ── Spinner ── */}
            <div className="loader-spinner">
                {/* Floating particles */}
                <div className="loader-particles">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="loader-particle" />
                    ))}
                </div>

                {/* Concentric rings */}
                <div className="loader-ring loader-ring--outer" />
                <div className="loader-ring loader-ring--middle" />
                <div className="loader-ring loader-ring--inner" />

                {/* Central core with icon */}
                <div className="loader-core">
                    <SparkIcon />
                </div>
            </div>

            {/* ── Text ── */}
            <div className="loader-body">
                <h1 className="loader-title">{title}</h1>
                <p className="loader-subtitle">{subtitle}</p>
                <div className="loader-dots">
                    <span /><span /><span />
                </div>
            </div>

            {/* ── Shimmer progress bar ── */}
            <div className="loader-progress">
                <div className="loader-progress__track">
                    <div className="loader-progress__bar" />
                </div>
            </div>

            {/* ── Animated steps (generate only) ── */}
            {variant === 'generate' && (
                <div className="loader-steps">
                    {GENERATION_STEPS.map((step, i) => {
                        const isDone   = i < activeStep
                        const isActive = i === activeStep
                        return (
                            <div
                                key={i}
                                className={`loader-step ${isDone ? 'loader-step--done' : ''} ${isActive ? 'loader-step--active' : ''}`}
                            >
                                <span className="loader-step__icon">
                                    {isDone ? <CheckIcon /> : null}
                                </span>
                                {step}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Loader
