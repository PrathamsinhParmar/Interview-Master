const express = require('express')
const authRouter = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieParser())

/**
 * @route POST/api/auth
 * @description Auth Routes (Register, Login, Logout)
 */
app.use('/api/auth', authRouter)

module.exports = app