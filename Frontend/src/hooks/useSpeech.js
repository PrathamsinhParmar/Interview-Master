import { useCallback, useRef, useState } from 'react'

/**
 * useSpeech — Zero-cost voice hook using the browser's native Web Speech API.
 *
 * Returns:
 *   speak(text)   — Make the browser read text aloud (TTS).
 *   stopSpeaking  — Immediately cancel any ongoing speech.
 *   listen()      — Start microphone recording; returns a Promise<string> with the transcript.
 *   stopListening — Abort an in-progress listen session.
 *   isListening   — boolean reactive state.
 *   isSpeaking    — boolean reactive state.
 *   speechSupported — true if Web Speech API is available in the browser.
 */
export function useSpeech() {

    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const recognitionRef = useRef(null)

    // ── Feature Detection ──────────────────────────────────────────────────────
    const speechSupported =
        typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
        'speechSynthesis' in window

    // ── Text-to-Speech (AI speaks) ────────────────────────────────────────────
    /**
     * speak(text) — reads the given string aloud using the best available voice.
     * Resolves when the utterance ends.
     */
    const speak = useCallback((text) => {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                resolve()
                return
            }

            // Cancel anything currently speaking
            window.speechSynthesis.cancel()

            const utterance = new SpeechSynthesisUtterance(text)

            // Pick the most natural-sounding English voice available
            const voices = window.speechSynthesis.getVoices()
            const preferred = voices.find(v =>
                v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
            ) || voices.find(v => v.lang.startsWith('en')) || null

            if (preferred) utterance.voice = preferred

            utterance.rate = 0.95   // Slightly slower than default for clarity
            utterance.pitch = 1.0
            utterance.volume = 1.0

            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => { setIsSpeaking(false); resolve() }
            utterance.onerror = () => { setIsSpeaking(false); resolve() }

            window.speechSynthesis.speak(utterance)
        })
    }, [])

    /**
     * stopSpeaking — cancel any ongoing TTS immediately.
     */
    const stopSpeaking = useCallback(() => {
        window.speechSynthesis?.cancel()
        setIsSpeaking(false)
    }, [])

    // ── Speech-to-Text (user speaks) ──────────────────────────────────────────
    /**
     * listen() — starts the microphone and returns a Promise<string> that resolves
     * with the final transcript once the user stops speaking (or after a silence timeout).
     */
    const listen = useCallback(() => {
        return new Promise((resolve, reject) => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (!SpeechRecognition) {
                reject(new Error('SpeechRecognition is not supported in this browser.'))
                return
            }

            const recognition = new SpeechRecognition()
            recognitionRef.current = recognition

            recognition.lang = 'en-US'
            recognition.interimResults = false   // We only want the final, confirmed transcript
            recognition.maxAlternatives = 1
            recognition.continuous = false       // Auto-stops after silence

            setIsListening(true)

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(r => r[0].transcript)
                    .join(' ')
                    .trim()
                setIsListening(false)
                resolve(transcript)
            }

            recognition.onerror = (event) => {
                setIsListening(false)
                // 'no-speech' is not really an error — just return empty string
                if (event.error === 'no-speech') {
                    resolve('')
                } else {
                    reject(new Error(`Speech recognition error: ${event.error}`))
                }
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognition.start()
        })
    }, [])

    /**
     * stopListening — abort an in-progress listen session.
     */
    const stopListening = useCallback(() => {
        recognitionRef.current?.stop()
        setIsListening(false)
    }, [])

    return {
        speak,
        stopSpeaking,
        listen,
        stopListening,
        isListening,
        isSpeaking,
        speechSupported,
    }
}
