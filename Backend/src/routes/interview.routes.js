const express = require('express')
const authMiddlewares = require('../middlewares/auth.middleware')
const interviewController = require("../controllers/interview.controller")
const upload = require('../middlewares/file.middleware')


const interviewRouter = express.Router()

/**
 * @route POST/api/interview/
 * @description Used to generate candidate interview report
 * @access Private
 */
interviewRouter.post('/', authMiddlewares.authUserMiddleware, upload.single("resume"),interviewController.generateInterviewReportController)

module.exports = interviewRouter