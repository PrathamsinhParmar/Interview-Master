const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, mockInterviewChat } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Converts raw API errors (e.g. Gemini quota JSON) into a clean user-facing message.
 */
function sanitizeError(err) {
    const raw = err?.message || ""
    if (raw.includes("RESOURCE_EXHAUSTED") || raw.includes("429") || raw.includes("quota")) {
        return "The AI service is currently busy or has reached its rate limit. Please wait a moment and try again."
    }
    if (raw.includes("UNAVAILABLE") || raw.includes("503")) {
        return "The AI service is temporarily unavailable. Please try again in a few seconds."
    }
    // Return a generic message — never expose raw JSON to the client
    return "Something went wrong communicating with the AI. Please try again."
}

async function generateInterViewReportController(req, res) {

    let resumeText = ""
    if (req.file) {
        try {
            const parsedPdf = await pdfParse(req.file.buffer)
            resumeText = parsedPdf.text || ""
        } catch (err) {
            console.error("Error parsing resume PDF:", err)
            return res.status(400).json({
                message: "Failed to parse the uploaded resume PDF."
            })
        }
    }
    const { selfDescription, jobDescription } = req.body

    if (!resumeText && !selfDescription) {
        return res.status(400).json({
            message: "Either a resume or a self description is required."
        })
    }

    try {
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Error generating report:", err)
        res.status(500).json({
            message: err.message || "Failed to generate interview report."
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to delete an interview report by interviewId.
 */
async function deleteInterviewReportController(req, res) {
    const { interviewId } = req.params

    const report = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id })

    if (!report) {
        return res.status(404).json({
            message: "Interview report not found or you are not authorized to delete it."
        })
    }

    res.status(200).json({
        message: "Interview report deleted successfully."
    })
}

/**
 * @description Start a new mock interview session.
 * Accepts a resume PDF + job setup params, parses the PDF, and returns the interviewer's opening greeting.
 * @route POST /api/interview/mock/start
 */
async function startMockInterviewController(req, res) {
    let resumeText = ""
    if (req.file) {
        try {
            const parsedPdf = await pdfParse(req.file.buffer)
            resumeText = parsedPdf.text || ""
        } catch (err) {
            console.error("Error parsing resume PDF:", err)
            return res.status(400).json({ message: "Failed to parse the uploaded resume PDF." })
        }
    }

    const { jobRole, experienceLevel, interviewFocus } = req.body

    if (!jobRole) {
        return res.status(400).json({ message: "Job role is required to start the interview." })
    }

    try {
        // Kick off with an empty history — AI will greet & ask Q1 on its own
        const result = await mockInterviewChat({
            resumeText,
            jobRole,
            experienceLevel: experienceLevel || "Mid",
            interviewFocus: interviewFocus || "Mixed",
            chatHistory: [],
            userMessage: "Hello, I am ready to start the interview.",
        })

        return res.status(200).json({
            message: "Mock interview started.",
            aiReply: result.aiReply,
            isFinished: result.isFinished,
            scorecard: result.scorecard,
            // Send back updated history for frontend to persist
            updatedHistory: [
                { role: "user", parts: [{ text: "Hello, I am ready to start the interview." }] },
                { role: "model", parts: [{ text: result.aiReply }] },
            ],
            // Pass session metadata back so frontend can re-use on subsequent turns
            sessionMeta: { resumeText, jobRole, experienceLevel: experienceLevel || "Mid", interviewFocus: interviewFocus || "Mixed" },
        })
    } catch (err) {
        console.error("Error starting mock interview:", err)
        return res.status(500).json({ message: sanitizeError(err) })
    }
}


/**
 * @description Send a user message in an ongoing mock interview session.
 * @route POST /api/interview/mock/chat
 */
async function mockInterviewChatController(req, res) {
    const { userMessage, chatHistory, resumeText, jobRole, experienceLevel, interviewFocus } = req.body

    if (!userMessage || !chatHistory || !jobRole) {
        return res.status(400).json({ message: "userMessage, chatHistory, and jobRole are required." })
    }

    try {
        const result = await mockInterviewChat({
            resumeText: resumeText || "",
            jobRole,
            experienceLevel: experienceLevel || "Mid",
            interviewFocus: interviewFocus || "Mixed",
            chatHistory,
            userMessage,
        })

        // Append latest turn to history
        const updatedHistory = [
            ...chatHistory,
            { role: "user", parts: [{ text: userMessage }] },
            { role: "model", parts: [{ text: result.aiReply }] },
        ]

        return res.status(200).json({
            aiReply: result.aiReply,
            isFinished: result.isFinished,
            scorecard: result.scorecard,
            updatedHistory,
        })
    } catch (err) {
        console.error("Error in mock interview chat:", err)
        return res.status(500).json({ message: sanitizeError(err) })
    }
}


module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController, startMockInterviewController, mockInterviewChatController }
