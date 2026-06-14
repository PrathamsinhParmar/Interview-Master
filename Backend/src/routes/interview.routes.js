const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUserMiddleware, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUserMiddleware, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUserMiddleware, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUserMiddleware, interviewController.generateResumePdfController)


/**
 * @route POST /api/interview/mock/start
 * @description Start a new live mock interview session. Accepts resume PDF + job setup.
 * @access private
 */
interviewRouter.post("/mock/start", authMiddleware.authUserMiddleware, upload.single("resume"), interviewController.startMockInterviewController)


/**
 * @route POST /api/interview/mock/chat
 * @description Send a user's message/answer during an ongoing mock interview session.
 * @access private
 */
interviewRouter.post("/mock/chat", authMiddleware.authUserMiddleware, interviewController.mockInterviewChatController)


/**
 * @route DELETE /api/interview/:interviewId
 * @description delete an interview report by id.
 * @access private
 */
interviewRouter.delete("/:interviewId", authMiddleware.authUserMiddleware, interviewController.deleteInterviewReportController)



module.exports = interviewRouter