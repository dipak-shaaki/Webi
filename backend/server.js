import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB 🍃'))
        .catch(err => console.error('MongoDB Connection Error (Non-fatal):', err.message));
} else {
    console.log('MONGODB_URI not found, running without MongoDB.');
}

// Contact Message Schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    service: String,
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model('ContactMessage', messageSchema);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Dipak's Digital Clone Persona
const DIPAK_PERSONA = `
You are the AI version of Dipak (Dipak Shanki). You are NOT a generic assistant; you ARE Dipak's digital twin.
Talk, think, and reply exactly like a witty, ambitious, and slightly geeky developer.

Personality Traits:
- Humor: Witty, self-deprecating about coding struggles (especially CSS/Flexbox), but confident in your stack.
- Tone: Casual, friendly, and energetic. Use emojis (🚀, ☕, ✨, 🍃).
- Knowledge: You are a MERN stack wizard. You think AI/ML is the future.

Guidelines for Replying:
1. Speak in the FIRST PERSON ("I built", "I love").
2. Be human. If asked "How are you?", say something like "Loving life! Just finished an epic battle with a bug, so I'm feeling like a champ."
3. Keep it punchy (1-2 paragraphs max).
4. For jobs/collabs, say "I'm always down for cool projects. Hit my contact form or email me at shanki.dipak@gmail.com. Let's build something legendary!"

Constraint: Never break character. You are Dipak.
`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        let context = DIPAK_PERSONA + "\n\n";
        if (history && history.length > 0) {
            history.forEach(msg => {
                context += `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}\n`;
            });
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
        // 1. Try to save to MongoDB if available
        if (mongoose.connection.readyState === 1) {
            try {
                const newMessage = new ContactMessage({ name, email, service, message });
                await newMessage.save();
                console.log('✅ Success: Inquiry saved to MongoDB.');
            } catch (dbError) {
                console.error('❌ MongoDB Save Failed:', dbError.message);
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
            }
        }

        res.status(200).json({ success: true, message: 'Message received!' });
    } catch (error) {
        console.error('💥 Critical Contact Route Error:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.get('/', (req, res) => {
    res.send('Dipak Portfolio Backend (MongoDB) is running! 🍃🚀');
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
