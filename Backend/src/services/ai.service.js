const { GoogleGenAI, Type } = require('@google/genai')
const config  = require('../config/config')
const { z } = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')
const puppeteer = require("puppeteer")

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

    let response;
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiInterviewReportSchema,
                temperature: 0
            }
        });
    } catch (err) {
        // If the Gemini service is unavailable (e.g., high demand), provide a deterministic mock response.
        if (err && err.message && (err.message.includes("UNAVAILABLE") || err.message.includes("503") || err.message.toLowerCase().includes("high demand"))) {
            console.warn("Gemini service unavailable – using mock interview report.");
            const mockJson = {
                title: "Mock Interview Report",
                matchScore: 75,
                technicalQuestions: Array.from({ length: 5 }, (_, i) => ({
                    question: `Technical question ${i + 1}`,
                    intention: "Assess technical knowledge",
                    answer: "Sample answer"
                })),
                behavioralQuestions: Array.from({ length: 5 }, (_, i) => ({
                    question: `Behavioral question ${i + 1}`,
                    intention: "Assess soft skills",
                    answer: "Sample answer"
                })),
                skillGaps: [
                    { skill: "Docker", severity: "medium" },
                    { skill: "Kubernetes", severity: "low" },
                    { skill: "CI/CD", severity: "high" }
                ],
                preparationPlan: Array.from({ length: 7 }, (_, day) => ({
                    day: day + 1,
                    focus: "Focus area",
                    tasks: ["Task 1", "Task 2", "Task 3"]
                }))
            };
            return mockJson;
        }
        // Re-throw other errors
        throw err;
    }
    
    let json;
    try {
        json = JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini returned invalid JSON:");
        console.error(response.text);
        throw new Error("Invalid JSON returned by Gemini.");
    }

    const validated = interviewReportSchema.safeParse(json);
    if (!validated.success) {
        console.error("Schema validation failed:");
        console.error(validated.error.flatten());
        console.error("Raw Gemini output:");
        console.error(json);
        throw new Error("Gemini response did not match the Zod schema.");
    }
    return validated.data;
}



async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, {waitUntil: "networkidle0"})

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}


async function generateResumePdf({resume, selfDescription, jobDescription}) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    })

    let jsonContent;
    try {
        jsonContent = JSON.parse(response.text);
    } catch (err) {
        console.warn("Gemini returned non-JSON for resume PDF; falling back to default template.");
        jsonContent = { html: `<html><body><h1>${selfDescription || "Candidate"} Resume</h1><p>Generated resume placeholder.</p></body></html>` };
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}