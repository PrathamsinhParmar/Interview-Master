const express = require('express');
const contactController = require('../controllers/contact.controller');
const rateLimit = require('express-rate-limit');

const contactRouter = express.Router();

// Basic rate limiting: limit each IP to 20 requests per 15 minutes
const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
    message: {
        success: false,
        message: 'Too many requests created from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * @route POST /api/contact/submit
 * @description Submit contact form
 * @access public
 */
contactRouter.post('/submit', contactRateLimiter, contactController.submitContactForm);

module.exports = contactRouter;
