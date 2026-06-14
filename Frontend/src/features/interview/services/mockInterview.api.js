import axios from 'axios'

const api = axios.create({ withCredentials: true })

/**
 * @description Start a fresh mock interview session.
 * Sends resume PDF + job setup. Backend parses the PDF and returns AI's opening greeting.
 */
export const startMockInterview = async ({ jobRole, experienceLevel, interviewFocus, resumeFile }) => {
    const formData = new FormData()
    formData.append('jobRole', jobRole)
    formData.append('experienceLevel', experienceLevel)
    formData.append('interviewFocus', interviewFocus)

    if (resumeFile instanceof File) {
        formData.append('resume', resumeFile)
    }

    const response = await api.post('/api/interview/mock/start', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
}

/**
 * @description Send a user's answer/message during an ongoing mock interview session.
 */
export const sendMockInterviewMessage = async ({ userMessage, chatHistory, sessionMeta }) => {
    const response = await api.post('/api/interview/mock/chat', {
        userMessage,
        chatHistory,
        resumeText: sessionMeta.resumeText,
        jobRole: sessionMeta.jobRole,
        experienceLevel: sessionMeta.experienceLevel,
        interviewFocus: sessionMeta.interviewFocus,
    })

    return response.data
}
