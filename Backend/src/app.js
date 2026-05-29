const express = require('express')
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/**
 * @route POST/api/auth
 * @description Auth Routes (Register, Login, Logout)
 */
app.use('/api/auth', authRouter)


/**
 * @route POST/api/interview
 * @description Interview Routes
 */
app.use('/api/interview', interviewRouter)

module.exports = app