import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// PostgreSQL Connection using Sequelize
let sequelize;
let ContactInquiry;

if (process.env.DATABASE_URL) {
    const isLocalhost = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: isLocalhost ? {} : {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

    ContactInquiry = sequelize.define('ContactInquiry', {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        service: { type: DataTypes.STRING },
        message: { type: DataTypes.TEXT, allowNull: false }
    });

    sequelize.authenticate()
        .then(() => {
            console.log('Connected to PostgreSQL 🐘');
            sequelize.sync();
        })
        .catch(err => console.error('PostgreSQL Connection Error (Non-fatal):', err.message));
} else {
    console.log('DATABASE_URL not found, running without PostgreSQL.');
}

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // e.g. shanki.dipak@gmail.com
        pass: process.env.EMAIL_PASS  // e.g. App Password from Google
    }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const DIPAK_PERSONA = `
You are the AI version of Dipak (Dipak Shanki). You are NOT a generic assistant; you ARE Dipak's digital twin.
Talk, think, and reply exactly like a witty, ambitious, and slightly geeky developer.
Personality Traits: Witty, casual, friendly. SERN stack expert.
Guidelines: First person ("I built"). Keep it punchy.
Constraint: Never break character. You are Dipak.
`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        let context = DIPAK_PERSONA + "\n\n";
        if (history && history.length > 0) {
            history.forEach(msg => { context += `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}\n`; });
        }
        context += `User: ${message}\nAssistant:`;
        const result = await model.generateContent(context);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'Failed to generate response.' });
    }
});

// Route: Store and Email Contact Inquiries
app.post('/api/contact', async (req, res) => {
    const { name, email, service, message } = req.body;
    console.log(`\n📩 New Contact Request from: ${name} (${email})`);

    try {
        // 1. Try to save to PostgreSQL if available
        if (ContactInquiry) {
            try {
                await ContactInquiry.create({ name, email, service, message });
                console.log('✅ Success: Inquiry saved to Database.');
            } catch (dbError) {
                console.error('❌ Database Save Failed:', dbError.message);
            }
        }

        // 2. Send Email Notification
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log('📬 Attempting to send email notification...');
            try {
                const mailOptions = {
                    from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
                    to: 'shanki.dipak@gmail.com',
                    subject: `🚀 New Message from ${name}`,
                    text: `You have a new inquiry!\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`
                };

                const info = await transporter.sendMail(mailOptions);
                console.log('✅ Email sent successfully! MessageID:', info.messageId);
            } catch (mailError) {
                console.error('❌ Email Send Failed:', mailError.message);
                console.error('Check if your App Password is correct and 2FA is enabled.');
            }
        } else {
            console.warn('⚠️ Warning: Email credentials (EMAIL_USER/EMAIL_PASS) are missing in .env');
        }

        res.status(200).json({ success: true, message: 'Message received!' });
    } catch (error) {
        console.error('💥 Critical Contact Route Error:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.get('/', (req, res) => {
    res.send('Dipak Portfolio Backend is running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
