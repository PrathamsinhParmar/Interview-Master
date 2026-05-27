const jwt = require('jsonwebtoken')
const config = require('../config/config')
const blacklistTokenModel = require('../models/blacklist.model')

async function authUserMiddleware(req, res, next){
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            message: "Refreshtoken is missing!"
        })
    }

    const isTokenBlacklisted = await blacklistTokenModel.findOne({
        refreshToken: refreshToken
    })

    if(isTokenBlacklisted){
        return res.status(400).json({
            message: "Token already blacklisted, You can't perform actions!"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
        
        req.user = decoded

        next()

    } catch (error) {
        return res.status(400).json({
            message: "Invalid refreshtoken!"
        })
    }

   
}

module.exports = {
    authUserMiddleware
}