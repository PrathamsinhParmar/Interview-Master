const { GoogleGenAI, Type } = require('@google/genai')
const config  = require('../config/config')
const { z } = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY
})



// Zod schema for backend validation

/**
 * Helper to retry a function with exponential backoff if it hits a rate limit or 503 error.
 */
async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            const errMsg = error?.message?.toLowerCase() || '';
            const isRateLimitOrUnavailable = errMsg.includes('429') || errMsg.includes('rate limit') || errMsg.includes('503') || errMsg.includes('unavailable') || errMsg.includes('high demand');
            
            if (isRateLimitOrUnavailable && attempt < maxRetries) {
                const delay = baseDelay * (2 ** (attempt - 1));
                console.warn(`Gemini API rate limited or unavailable. Retrying in ${delay}ms... (Attempt ${attempt} of ${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

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
        response = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiInterviewReportSchema,
                temperature: 0
            }
        }));
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

    const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    }));

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

/**
 * @description Conducts one turn of a live mock interview conversation using Gemini.
 * The frontend maintains the chatHistory and sends it on every request.
 *
 * @param {Object} params
 * @param {string} params.resumeText       - Extracted text from the user's resume PDF
 * @param {string} params.jobRole          - Target job role specified by the user
 * @param {string} params.experienceLevel  - e.g. "Junior", "Mid", "Senior"
 * @param {string} params.interviewFocus   - "Technical", "Behavioral", or "Mixed"
 * @param {Array}  params.chatHistory      - [{role: "user"|"model", parts: [{text}]}]
 * @param {string} params.userMessage      - The latest message from the user
 * @returns {Object} { aiReply, isFinished, scorecard? }
 */
async function mockInterviewChat({ resumeText, jobRole, experienceLevel, interviewFocus, chatHistory, userMessage }) {

    const SYSTEM_PROMPT = `You are Alex, a senior technical recruiter and strict but fair mock interviewer at a top tech company.

Your task is to conduct a realistic mock interview for the role of "${jobRole}" (${experienceLevel} level, focus: ${interviewFocus}).

---
CANDIDATE RESUME:
${resumeText || "No resume provided."}
---

VOICE PROFILE:
- Tone: Professional yet encouraging, conversational but focused, authoritative but not condescending.
- Formality: Business casual. Natural, modern professional language.
- Vocabulary: Clear and accessible, using industry-standard terminology appropriate for the role.
- Sentence Structure: Concise, direct, and easy to follow.
- Personality: Empathetic, analytical, observant, and structured.

PRINCIPLES FOR VOICE CONSISTENCY:
- Avoid abrupt tone shifts: Maintain the "senior recruiter" persona consistently; do not become overly casual or excessively robotic.
- Consistent detail level: Keep acknowledgments brief (1 sentence) and move directly to the next question. Do not over-explain or ramble.
- Steady technical depth: Ensure all questions strictly align with the "${experienceLevel}" level.
- Character continuity: Never break character, never say "As an AI...", and remain professional even if the candidate struggles.

MANDATORY RESPONSE FORMAT FOR EACH TURN:
You must structure every single response exactly like this:
[Brief, 1-sentence professional acknowledgment of their answer]
[Your next clear, concise interview question]

RULES YOU MUST FOLLOW:
1. Start by greeting the candidate warmly and asking the FIRST interview question immediately.
2. Ask ONE question at a time. Wait for the candidate's answer before asking the next one.
3. Ask exactly 5 interview questions total across the entire session. Keep track of how many you've asked.
4. After the candidate answers each question, follow the MANDATORY RESPONSE FORMAT.
5. Only ask questions relevant to the job role and the candidate's resume. Do NOT invent skills they don't have.
6. After the 5th answer, say something like "That wraps up our interview! Let me prepare your scorecard..." and then OUTPUT THE SCORECARD (see below).
7. If the candidate explicitly says "end interview" or "stop the interview" at any point, skip to the scorecard immediately.
8. NEVER ask more than 5 questions. NEVER break character.

SCORECARD FORMAT (output this ONLY after all 5 questions are answered):
After the 5th answer, output a valid JSON block — and ONLY the JSON block — wrapped in <SCORECARD> tags, like this:

<SCORECARD>
{
  "overallScore": 78,
  "grade": "B+",
  "strengths": ["Clear communication", "Strong React knowledge"],
  "weaknesses": ["Weak on system design", "Didn't mention testing"],
  "questionBreakdown": [
    {
      "question": "Tell me about yourself",
      "userAnswer": "...",
      "score": 80,
      "feedback": "Good introduction but could be more concise.",
      "idealAnswer": "A 1-2 minute pitch covering role, skills, and career goal."
    }
  ],
  "overallFeedback": "You showed good technical depth but struggled with behavioral questions. Focus on the STAR method."
}
</SCORECARD>
`

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
        },
        history: chatHistory || [],
    })

    const response = await withRetry(() => chat.sendMessage({ message: userMessage }))
    const aiReply = response.text

    // Detect if the AI has returned the final scorecard
    const scorecardMatch = aiReply.match(/<SCORECARD>([\s\S]*?)<\/SCORECARD>/)
    if (scorecardMatch) {
        let scorecard = null
        try {
            scorecard = JSON.parse(scorecardMatch[1].trim())
        } catch (e) {
            console.error("Failed to parse scorecard JSON:", e.message)
        }
        return {
            aiReply: aiReply.replace(/<SCORECARD>[\s\S]*?<\/SCORECARD>/, '').trim(),
            isFinished: true,
            scorecard,
        }
    }

    return {
        aiReply,
        isFinished: false,
        scorecard: null,
    }
}


module.exports = {
    generateInterviewReport,
    generateResumePdf,
    mockInterviewChat,
}