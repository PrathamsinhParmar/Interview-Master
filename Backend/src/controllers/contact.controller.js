const { z } = require('zod');
const emailService = require('../services/email.service');

// Zod schema for input validation
const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
    email: z.string().email('Invalid email format'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters long').max(1000),
});

exports.submitContactForm = async (req, res) => {
    try {
        // Validate request body
        const validatedData = contactSchema.parse(req.body);

        // Optional: Get IP address for logging/reference (if needed)
        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Send Notification to Owner
        await emailService.sendContactNotificationToOwner(validatedData);

        // Send Confirmation to User
        await emailService.sendConfirmationToUser(validatedData);

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully.',
        });

    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError || error.name === 'ZodError') {
            const issues = error.errors || error.issues || [];
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: issues.map(err => ({ field: err.path[0], message: err.message })),
            });
        }

        console.error('Contact Form Error:', error);

        // Handle Nodemailer or server errors
        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message. Please try again later.',
        });
    }
};
