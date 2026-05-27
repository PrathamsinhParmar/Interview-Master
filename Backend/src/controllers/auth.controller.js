const userModel = require('../models/user.model')
const blaklistTokenModel = require('../models/blacklist.model')
const config = require('../config/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


/**
 * @name registerUserController
 * @description Used to register a new user (username, email, password)
 */
const registerUserController = async(req, res)=>{
    const { username, email, password } = req.body

    if(!email || !password || !username ){
        return res.status(400).json({
            message: "Username, email & password is required!"
        })
    }

    const isExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(isExists){
        return res.status(400).json({
            message: "Email or Username already existes!"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username: username,
        email: email,
        password: hashPassword
    })

    const refreshToken = jwt.sign({
        userId: user._id,
        username: user.username
    }, config.JWT_SECRET, 
    { 
        expiresIn: "7d"
    })

    const accessToken = jwt.sign({
        userId: user._id,
        username: user.username
    }, config.JWT_SECRET, 
    {
        expiresIn: "10m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
    })

    res.status(201).json({
        message: "User registered successfully!",
        user: user,
        accessToken
    })
}


/**
 * @name loginUserController
 * @description Used to login a registered user into system (username / email, password)
 */
const loginUserController = async (req, res)=>{
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(400).json({
            message: "User not found!"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        return res.status(401).json({
            message: "Invalid Password!"
        })
    }

    const refreshToken = jwt.sign({
        userId: user._id,
        username: user.username
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )

    const accessToken = jwt.sign({
        userId: user._id,
        username: user.username
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
    })

    res.status(200).json({
        message: "User loggedin successfully",
        user: user,
        accessToken
    })
}

/**
 * @name logoutUserController
 * @description Used to logout a loggedin user
 */
const logoutUserController = async (req, res)=>{
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(400).json({
            message: "Refreshtoken is missing!"
        })
    }

    const blackLsitedToken = await blaklistTokenModel.create({
        refreshToken: refreshToken
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "User loggedout successfully!"
    })

}

/**
 * @name getUserDataController
 * @description Used to get user details
 */
const getUserDataController = async (req, res)=>{
 
    const user = await userModel.findById( req.user.userId )

    if(!user){
        return res.status(400).json({
            message: "User not found!"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully!",
        user: user
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getUserDataController
}