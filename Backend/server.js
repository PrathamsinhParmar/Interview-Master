const app = require('./src/app')
const config = require('./src/config/config')
const connectDB = require('./src/config/db')
const cookieParser = require('cookie-parser')
const generateInterviewReport = require('./src/services/ai.service')
const { resume, jobDescription, selfDescription } = require('./src/services/testData')

app.use(cookieParser())

connectDB()
generateInterviewReport({resume, jobDescription, selfDescription })


app.listen(config.PORT, (req, res)=>{
    console.log(`Server is running on : http://localhost:${config.PORT}`)
})