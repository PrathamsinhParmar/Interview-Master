const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be Blacklisted!"],
        unique: [true, "Token must be unique"]
    }
}, {
    timestamps: true
})

const blacklistTokenModel = mongoose.model("blacklist", blacklistTokenSchema)

module.exports = blacklistTokenModel