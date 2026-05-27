const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username is already taken!"],
        required: [true, "Username is required!" ]
    },
    email:{
        type: String,
        unique: [true, "Email already exists!"],
        require: [true, "Email is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    }
}, {
    timestamps : true
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel