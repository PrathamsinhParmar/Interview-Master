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

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = config