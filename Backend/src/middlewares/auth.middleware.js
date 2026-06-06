const jwt = require('jsonwebtoken')
const config = require('../config/config')
const blacklistTokenModel = require('../models/blacklist.model')

async function authUserMiddleware(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Token is missing!"
        })
    }

    const isTokenBlacklisted = await blacklistTokenModel.findOne({
        token: token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is blacklisted, please login again!"
        })
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        
        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token!"
        })
    }

   
}

module.exports = {
    authUserMiddleware
}