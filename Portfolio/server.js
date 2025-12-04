// Backend Server for Contact Form
// This is a Node.js/Express server to handle contact form submissions
// 
// To use this:
// 1. Install dependencies: npm install express cors nodemailer dotenv
// 2. Create a .env file with your email credentials
// 3. Run: node server.js
// 4. Update the fetch URL in script.js to: http://localhost:3000/api/contact

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure email transporter
// For Gmail, you'll need to create an App Password: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'smtp.gmail.com' for custom SMTP
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your app password (not regular password)
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.YOUR_EMAIL, // Your email where you want to receive messages
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>This message was sent from your portfolio contact form.</em></p>
            `,
            replyTo: email // So you can reply directly
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Optional: Save to database
        // You can add MongoDB, PostgreSQL, etc. here
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully!' 
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Contact endpoint: http://localhost:${PORT}/api/contact`);
});

