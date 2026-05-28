const { GoogleGenAI } = require('@google/genai')
const config  = require('../config/config')
const z = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY
})


const interviewReportSchema = z.object({

    matchScore: z.number().describe("A score between 0 to 100 indication how well the candidate's matches the job description."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(z.object({
        skills: z.string().describe("The skills which the candidate is lacking."),
        severity: z.enum(["LOW", "MEDIUM", "HIGN"]).describe("The severity of the skill gap. i.e How important is this skill for the job.")
    })).describe("List of skill gaps in the candidate's profile along with their severity."),

    preprationPlan: z.array(z.object({
        day: z.number().describe("The day number in the prepration plan, starting for 1"),
        focus: z.string().describe("The main focus of this day in prepration plan, e.g data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tsks to be done on this day to follow the prepration plan, e.g. read a specific book on topics etc")
    })).describe("A day wise prepration plan for the candidate to follow in order to prepare for the interview effectively.")

})

const generateInterviewReport = async({resume, selfDescription, jobDescription})=>{


    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume: ${resume},
                    Self Descrition: ${selfDescription},
                    Job Description: ${jobDescription}
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })


    const data = JSON.parse(response.text)

    console.log(data)

}

module.exports = generateInterviewReport