const nodemailer = require('nodemailer');
const { getOwnerNotificationTemplate, getUserConfirmationTemplate } = require('../templates/email.templates');

// Use Gmail settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password for Gmail
    },
});

/**
 * Send an email to the site owner containing the contact form submission.
 */
exports.sendContactNotificationToOwner = async (data) => {
    const { name, email, phone, message } = data;
    
    const mailOptions = {
        from: process.env.SMTP_USER, // Sent from your authenticated Gmail
        to: process.env.CONTACT_EMAIL_RECEIVER || process.env.SMTP_USER, // To you
        replyTo: email, // Reply-To the user's email address
        subject: `Interview Master - New Contact Form Submission from ${name}`,
        html: getOwnerNotificationTemplate(data),
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send a confirmation email to the user acknowledging receipt.
 */
exports.sendConfirmationToUser = async (data) => {
    const { name, email } = data;
    
    const mailOptions = {
        from: `Interview Master <${process.env.SMTP_USER}>`, // Sent from you
        to: email, // To the user
        subject: `We've received your message, ${name}`,
        html: getUserConfirmationTemplate(data),
    };

    return transporter.sendMail(mailOptions);
};
