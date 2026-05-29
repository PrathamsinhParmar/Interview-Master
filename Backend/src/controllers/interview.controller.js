const userModel = require('../models/user.model')
const interviewReportModel = require('../models/interviewReport.model')
const pdfParse = require('pdf-parse')
const generateInterviewReport = require('../services/ai.service')


const generateInterviewReportController = async (req, res)=>{

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    try {
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })


        const interviewReport = await interviewReportModel.create({
            user: req.user.userId,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report created successfully!",
            interviewReport
        })
    } catch (error) {
        console.log("Error: ",error)
    }
    
}


module.exports = {
    generateInterviewReportController
}
