const app = require('./src/app')
const config = require('./src/config/config')
const connectDB = require('./src/config/db')
const cookieParser = require('cookie-parser')

connectDB()

app.listen(config.PORT, (req, res)=>{
    console.log(`Server is running on : http://localhost:${config.PORT}`)
})