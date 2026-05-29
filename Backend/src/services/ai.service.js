const { GoogleGenAI, Type } = require('@google/genai')
const config  = require('../config/config')
const { z } = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY
})



// Zod schema for backend validation
const interviewReportSchema = z
    .object({

        title: z.string().min(1),

        matchScore: z.number().int().min(0).max(100),

        technicalQuestions: z.array(
            z.object({
                question: z.string().min(1),
                intention: z.string().min(1),
                answer: z.string().min(1),
            })
        ).length(5),

        behavioralQuestions: z.array(
            z.object({
                question: z.string().min(1),
                intention: z.string().min(1),
                answer: z.string().min(1),
            })
        ).length(5),

        skillGaps: z.array(
            z.object({
                skill: z.string().min(1),
                severity: z.enum(["low", "medium", "high"]),
            })
        ).min(3).max(6),

        preparationPlan: z.array(
            z.object({
                day: z.number().int().min(1).max(7),
                focus: z.string().min(1),
                tasks: z.array(z.string().min(1)).min(3).max(5),
            })
        ).length(7),

    })
    .strict();


// Gemini schema for response generation
const geminiInterviewReportSchema = {
    type: Type.OBJECT,
    properties: {

        title: {
            type: Type.STRING,
        },

        matchScore: {
            type: Type.INTEGER,
            description: "A score between 0 to 100 indication how well the candidate's matches the job description.",
        },

        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them.",
            minItems: 5,
            maxItems: 5,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The technical question can be asked in the interview"
                    },
                    intention: {
                        type: Type.STRING,
                        description: "The intention of interviewer behind asking this question"
                    },
                    answer: {
                        type: Type.STRING,
                        description: "How to answer this question, what points to cover, what approach to take etc."
                    },
                },
                required: ["question", "intention", "answer"],
            },
        },

        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",
            minItems: 5,
            maxItems: 5,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The behavioral question can be asked in the interview"
                    },
                    intention: {
                        type: Type.STRING,
                        description: "The intention of interviewer behind asking this question"
                    },
                    answer: {
                        type: Type.STRING,
                        description: "How to answer this question, what points to cover, what approach to take etc."
                    },
                },
                required: ["question", "intention", "answer"],
            },
        },

        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity.",
            minItems: 3,
            maxItems: 6,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: {
                        type: Type.STRING,
                        description: "The skills which the candidate is lacking."
                    },
                    severity: {
                        type: Type.STRING,
                        description: "The severity of the skill gap. i.e How important is this skill for the job.",
                        enum: ["low", "medium", "high"],
                    },
                },
                required: ["skill", "severity"],
            },
        },

        preparationPlan: {
            type: Type.ARRAY,
            description: "A day wise prepration plan for the candidate to follow in order to prepare for the interview effectively.",
            minItems: 7,
            maxItems: 7,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: {
                        type: Type.INTEGER,
                        description: "The day number in the prepration plan, starting from 1"
                    },
                    focus: {
                        type: Type.STRING,
                        description: "The main focus of this day in prepration plan, e.g. data structures, system design, mock interviews etc."
                    },
                    tasks: {
                        type: Type.ARRAY,
                        minItems: 3,
                        maxItems: 5,
                        items: {
                            type: Type.STRING,
                            description: "List of tasks to be done on this day to follow the prepration plan, e.g. read a specific book on topics etc."
                        },
                    },
                },
                required: ["day", "focus", "tasks"],
            },
        },

    },
    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
    ],
};


const generateInterviewReport = async({resume, selfDescription, jobDescription})=>{


    const prompt = `You are a strict interview report generator.

        Generate an interview report for a candidate using ONLY the information provided below.

        Resume:
        ${resume || "Not provided"}

        Self Description:
        ${selfDescription || "Not provided"}

        Job Description:
        ${jobDescription || "Not provided"}

        STRICT RULES:
        - Return only valid JSON.
        - Do not return markdown.
        - Do not add text before or after the JSON.
        - Do not wrap the JSON in code blocks.
        - Do not invent unsupported experience, skills, projects, companies, education, certifications, or achievements.
        - matchScore must be a whole number between 0 and 100.
        - technicalQuestions must contain exactly 5 items.
        - behavioralQuestions must contain exactly 5 items.
        - skillGaps must contain between 3 and 6 items.
        - preparationPlan must contain exactly 7 days.
        - Each preparationPlan item must contain 3 to 5 tasks.
        - severity must be only "low", "medium", or "high".
        - title must be extracted from the job description. If unavailable, use "Not provided".

`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: geminiInterviewReportSchema,
            temperature: 0
        }
    })


    const data = JSON.parse(response.text)

    console.log(data)

}

module.exports = generateInterviewReport