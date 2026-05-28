const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddlewares = require('../middlewares/auth.middleware')

const authRouter = express.Router()

/**
 * @route POST/api/auth/register
 * @description Used to register a new user into system
 * @access Public
 */
authRouter.post('/register', authController.registerUserController)

/**
 * @route POST/api/auth/login
 * @description Used to login a registered user into system
 * @access Public
 */
authRouter.post('/login', authController.loginUserController)


/**
 * @route POST/api/auth/logout
 * @description Used to logout a loggedin user
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController)


/**
 * @route POST/api/auth/get-me
 * @description Used to fetch user details
 * @access Private
 */
authRouter.get('/get-me', authMiddlewares.authUserMiddleware ,authController.getUserDataController)

module.exports = authRouter