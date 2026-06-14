import React from 'react'
import './AILoader.scss'

/**
 * AILoader – animated AI avatar for the Mock Interview session.
 * Shows a rotating glowing sphere + bouncing "Alex" letters.
 * The `speaking` prop intensifies the glow when the AI is talking.
 */
const LETTERS = ['A', 'l', 'e', 'x']

const AILoader = ({ speaking = false }) => {
    return (
        <div className={`ai-loader ${speaking ? 'ai-loader--speaking' : ''}`}>
            <div className="ai-loader__sphere-wrap">
                <div className="ai-loader__sphere" />
            </div>
            <div className="ai-loader__letters">
                {LETTERS.map((char, i) => (
                    <span
                        key={i}
                        className="ai-loader__letter"
                        style={{ animationDelay: `${i * 0.12}s` }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default AILoader
