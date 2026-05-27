const mongoose = require('mongoose')
const config = require('./config')

const connectDB = ()=>{
    mongoose.connect(config.MONGO_URI)
    .then(()=>{
        console.log("Database connected successfully!")
    })
    .catch((err)=>{
        console.log("Error connecting to database,",err)
    })
}

module.exports = connectDB