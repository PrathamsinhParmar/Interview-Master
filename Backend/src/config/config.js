require('dotenv').config()

if(!process.env.PORT){
    console.log("PORT is required!")
}

if(!process.env.MONGO_URI){
    console.log("MONGO_URI is required!")
}

if(!process.env.JWT_SECRET){
    console.log("JWT_SECRET is required!")
}

if(!process.env.GEMINI_API_KEY){
    console.log("GEMINI_API_KEY is required!")
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
}

module.exports = config