const express = require('express')
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
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