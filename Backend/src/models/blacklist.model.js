const mongoose = require('mongoose')

const blaklistTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: [true, "Refreshtoken is required to be Blacklisted!"],
        unique: [true, "Refreshtoken must be unique"]
    }
}, {
    timestamps: true
})

const blaklistTokenModel = mongoose.model("blacklist", blaklistTokenSchema)

module.exports = blaklistTokenModel