const getBaseEmailStyles = () => `
    <style>
        /* Base Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #0f0f13;
            color: #d1d5db;
            line-height: 1.7;
            -webkit-font-smoothing: antialiased;
        }

        .email-wrapper {
            background-color: #0f0f13;
            padding: 32px 16px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #16161d;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #2a2a38;
        }

        /* Header */
        .header {
            background: #16161d;
            padding: 48px 40px 40px;
            text-align: left;
            border-bottom: 1px solid #2a2a38;
            position: relative;
            overflow: hidden;
        }

        .header-accent-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #3BC1A8 0%, #249E94 40%, #0C7779 100%);
        }

        .header-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(0, 236, 185, 0.67);
            color: #3BC1A8;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 5px 12px;
            border-radius: 20px;
            margin-bottom: 20px;
        }

        .header-eyebrow-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #3BC1A8;
            border-radius: 50%;
        }

        .header h1 {
            color: #f9fafb;
            margin: 0 0 10px;
            font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            line-height: 1.25;
        }

        .header-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }

        /* Body */
        .body-content {
            padding: 36px 40px;
            background-color: #16161d;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #f3f4f6;
            margin: 0 0 12px;
        }

        .body-content p {
            margin: 0 0 16px;
            font-size: 15px;
            color: #9ca3af;
            line-height: 1.75;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #2a2a38;
            margin: 28px 0;
        }

        /* Summary Card */
        .summary-card {
            background-color: #1e1e28;
            border: 1px solid #2a2a38;
            border-radius: 12px;
            padding: 4px 0;
            margin: 24px 0;
            overflow: hidden;
        }

        .summary-row {
            padding: 16px 20px;
            border-bottom: 1px solid #2a2a38;
        }

        .summary-row:last-child {
            border-bottom: none;
        }

        .summary-label {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: block;
            margin-bottom: 4px;
        }

        .summary-value {
            font-size: 15px;
            color: #e5e7eb;
            font-weight: 500;
        }

        .summary-value a {
            color: #3BC1A8;
            text-decoration: none;
        }

        /* Message Box */
        .message-box {
            background-color: #13131a;
            border-left: 3px solid #3BC1A8;
            padding: 16px 18px;
            margin-top: 10px;
            color: #9ca3af;
            font-size: 14px;
            border-radius: 0 8px 8px 0;
            white-space: pre-wrap;
            line-height: 1.75;
            font-style: italic;
        }

        /* Badge row for timestamps etc */
        .meta-badge {
            display: inline-block;
            background: rgba(245, 158, 11, 0.08);
            border: 1px solid rgba(245, 158, 11, 0.2);
            color: #3BC1A8;
            font-size: 12px;
            font-weight: 500;
            padding: 3px 10px;
            border-radius: 6px;
        }

        /* Button */
        .button-wrapper {
            text-align: center;
            margin-top: 32px;
        }

        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #3BC1A8 0%, #0C7779 100%);
            color: #0f0f13 !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            letter-spacing: 0.3px;
        }

        .action-button-secondary {
            display: inline-block;
            background: transparent;
            color: #9ca3af !important;
            text-decoration: none;
            padding: 13px 28px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            border: 1px solid #2a2a38;
            margin-left: 12px;
        }

        /* Stats row */
        .stats-row {
            display: table;
            width: 100%;
            background: #1e1e28;
            border: 1px solid #2a2a38;
            border-radius: 10px;
            overflow: hidden;
            margin: 24px 0;
        }

        .stat-cell {
            display: table-cell;
            text-align: center;
            padding: 18px 10px;
            border-right: 1px solid #2a2a38;
        }

        .stat-cell:last-child {
            border-right: none;
        }

        .stat-number {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 22px;
            font-weight: 700;
            color: #3BC1A8;
            display: block;
            line-height: 1;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        /* Alert Box */
        .alert-box {
            background: rgba(245, 158, 11, 0.06);
            border: 1px solid rgba(245, 158, 11, 0.2);
            border-radius: 10px;
            padding: 16px 20px;
            margin: 24px 0;
            display: flex;
        }

        .alert-icon {
            font-size: 18px;
            margin-right: 12px;
            line-height: 1.5;
        }

        .alert-text {
            font-size: 14px;
            color: #d1d5db;
            margin: 0;
            line-height: 1.6;
        }

        /* Footer */
        .footer {
            background-color: #111117;
            padding: 28px 40px;
            text-align: center;
            border-top: 1px solid #2a2a38;
        }

        .footer-brand {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 16px;
            font-weight: 700;
            color: #f3f4f6;
            letter-spacing: -0.3px;
            margin: 0 0 4px;
        }

        .footer-tagline {
            font-size: 12px;
            color: #4b5563;
            margin: 0 0 16px;
            letter-spacing: 0.3px;
        }

        .footer-links {
            margin: 0 0 16px;
        }

        .footer-links a {
            color: #6b7280;
            text-decoration: none;
            font-size: 12px;
            margin: 0 10px;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: #0C7779;
        }

        .footer-legal {
            font-size: 11px;
            color: #374151;
            margin: 0;
            line-height: 1.6;
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            .email-container { border-radius: 0; width: 100% !important; }
            .email-wrapper { padding: 0; }
            .header, .body-content, .footer { padding: 28px 20px; }
            .header h1 { font-size: 22px; }
            .action-button-secondary { display: block; margin-left: 0; margin-top: 10px; }
            .stat-number { font-size: 18px; }
        }
    </style>
`;

/**
 * HTML Template for Owner Notification Email
 */
exports.getOwnerNotificationTemplate = (data) => {
    const { name, email, phone, message } = data;
    const dateStr = new Date().toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Submission</title>
        ${getBaseEmailStyles()}
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f0f13;">
        <div class="email-wrapper">
        <!-- [if mso]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td>
        <![endif] -->
        <table class="email-container" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px; margin: auto;">
            <tr>
                <td class="header">
                    <div class="header-accent-bar"></div>
                    <div class="header-eyebrow">
                        <span class="header-eyebrow-dot"></span>
                        New Lead Alert
                    </div>
                    <h1>Incoming Inquiry</h1>
                    <p class="header-subtitle">Someone just reached out via your website contact form</p>
                </td>
            </tr>
            <tr>
                <td class="body-content">
                    <p class="greeting">Action Required</p>
                    <p>A new contact form submission has just landed. Review the details below and follow up promptly to maximize conversion.</p>

                    <div class="alert-box">
                        <span class="alert-icon">⚡</span>
                        <p class="alert-text">Leads followed up within <strong style="color: #fbbf24;">1 hour</strong> are 7× more likely to convert. Consider reaching out now.</p>
                    </div>

                    <div class="summary-card">
                        <div class="summary-row">
                            <span class="summary-label">Submitted On</span>
                            <span class="summary-value"><span class="meta-badge">${dateStr}</span></span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Full Name</span>
                            <span class="summary-value">${name}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Email Address</span>
                            <span class="summary-value"><a href="mailto:${email}">${email}</a></span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Phone Number</span>
                            <span class="summary-value">${phone || '<em style="color: #4b5563; font-style: italic;">Not provided</em>'}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Message</span>
                            <div class="message-box">${message}</div>
                        </div>
                    </div>

                    <div class="button-wrapper">
                        <a href="mailto:${email}?subject=Re: Your inquiry – Interview Master" class="action-button">
                            Reply to ${name.split(' ')[0]} →
                        </a>
                        <a href="tel:${phone || ''}" class="action-button-secondary">
                            Call Now
                        </a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-brand">Interview Master</p>
                    <p class="footer-tagline">Automated system notification · Do not reply to this email</p>
                    <div class="footer-links">
                        <a href="#">Dashboard</a>
                        <a href="#">All Leads</a>
                        <a href="#">Settings</a>
                    </div>
                    <p class="footer-legal">This notification was triggered by a form submission on interviewmaster.com. IP address has been securely logged.</p>
                </td>
            </tr>
        </table>
        <!-- [if mso]>
        </td></tr></table>
        <![endif] -->
        </div>
    </body>
    </html>
    `;
};

/**
 * HTML Template for User Confirmation Email
 */
exports.getUserConfirmationTemplate = (data) => {
    const { name, email, message } = data;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>We received your message – Interview Master</title>
        ${getBaseEmailStyles()}
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f0f13;">
        <div class="email-wrapper">
        <!-- [if mso]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td>
        <![endif] -->
        <table class="email-container" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px; margin: auto;">
            <tr>
                <td class="header">
                    <div class="header-accent-bar"></div>
                    <div class="header-eyebrow">
                        <span class="header-eyebrow-dot"></span>
                        Interview Master
                    </div>
                    <h1>Message Received.</h1>
                    <p class="header-subtitle">We'll be in touch sooner than you think.</p>
                </td>
            </tr>
            <tr>
                <td class="body-content">
                    <p class="greeting">Hi ${name},</p>
                    <p>Thanks for reaching out. Your message has landed safely in our inbox and a real human on our team will review it shortly.</p>
                    <p>We typically respond within <strong style="color: #f3f4f6;">1–2 business days</strong>, but we often beat that window.</p>

                    <hr class="divider">

                    <div class="stats-row">
                        <div class="stat-cell">
                            <span class="stat-number">1–2</span>
                            <span class="stat-label">Day Response</span>
                        </div>
                        <div class="stat-cell">
                            <span class="stat-number">24/7</span>
                            <span class="stat-label">Support Access</span>
                        </div>
                        <div class="stat-cell">
                            <span class="stat-number">10k+</span>
                            <span class="stat-label">Interviews Aced</span>
                        </div>
                    </div>

                    <p style="margin-top: 8px;">For reference, here's what you sent us:</p>

                    <div class="summary-card">
                        <div class="summary-row">
                            <span class="summary-label">Your Message</span>
                            <div class="message-box">${message}</div>
                        </div>
                    </div>

                    <p>Need something urgent? Reply directly to this email or write to us at <a href="mailto:hello@interviewmaster.com" style="color: #fbbf24; text-decoration: none;">hello@interviewmaster.com</a>.</p>

                    <p style="margin-top: 28px; margin-bottom: 0; color: #6b7280; font-size: 14px;">
                        Warmly,<br>
                        <strong style="color: #e5e7eb; font-size: 15px;">The Interview Master Team</strong>
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-brand">Interview Master</p>
                    <p class="footer-tagline">Elevating careers, one interview at a time.</p>
                    <div class="footer-links">
                        <a href="#">Website</a>
                        <a href="#">Resources</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Unsubscribe</a>
                    </div>
                    <p class="footer-legal">You received this because you submitted a contact form on interviewmaster.com.</p>
                </td>
            </tr>
        </table>
        <!-- [if mso]>
        </td></tr></table>
        <![endif] -->
        </div>
    </body>
    </html>
    `;
};