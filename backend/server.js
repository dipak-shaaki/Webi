import express from 'express';
import crypto from 'node:crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());

// Add this to handle preflight requests specifically
app.options('*', cors());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.use(express.json());


const PORT = process.env.PORT || 5000;

// MongoDB Connection
if (process.env.DATABASE_URL) {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log('Connected to MongoDB 🍃'))
        .catch(err => console.error('MongoDB Connection Error (Non-fatal):', err.message));
} else {
    console.log('DATABASE_URL not found, running without MongoDB.');
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

// --- NEW SCHEMAS FOR DIPAK AI (Step 2) ---

const profileSchema = new mongoose.Schema({
    name: String,
    personality: String,
    hobbies: [String],
    likes: [String],
    slangDictionary: [String],
    bio: String
});
const Profile = mongoose.model('Profile', profileSchema);

// Private relationship profiles used by the identity discovery flow.
const knownPersonSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    aliases: [String],
    initials: [String],
    relationshipType: { type: String, enum: ['friend', 'family', 'school', 'plusTwo', 'bachelors', 'work', 'stranger'], default: 'stranger' },
    contexts: [String],
    memories: [String],
    tone: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
const KnownPerson = mongoose.model('KnownPerson', knownPersonSchema);

const identitySessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    answers: [{ questionId: String, value: String }],
    candidateIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnownPerson' }],
    status: { type: String, enum: ['active', 'matched', 'unknown'], default: 'active' },
    matchedPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'KnownPerson', default: null }
}, { timestamps: true });
const IdentitySession = mongoose.model('IdentitySession', identitySessionSchema);

const memeSchema = new mongoose.Schema({
    trigger: { type: String, required: true, lowercase: true },
    response: { type: String, required: true }
});
const Meme = mongoose.model('Meme', memeSchema);

const relationshipSchema = new mongoose.Schema({
    userId: String, // Can be IP or a unique identifier
    type: { type: String, enum: ['friend', 'family', 'work', 'stranger'], default: 'stranger' },
    lastInteraction: { type: Date, default: Date.now }
});
const Relationship = mongoose.model('Relationship', relationshipSchema);

const chatLogSchema = new mongoose.Schema({
    userId: String,
    message: String,
    reply: String,
    toneUsed: String,
    isMemeTriggered: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});
const ChatLog = mongoose.model('ChatLog', chatLogSchema);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps with some cloud provider network issues
    }
});

// Validate Transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email Connection Error:', error.message);
    } else {
        console.log('✅ Email Service Ready (SMTP)');
    }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Dipak's Digital Clone Persona (Step 1)
const DIPAK_DATA = {
    name: "Dipak",
    birthday: "February 4th",
    origin: "Dadeldhura, Nepal",
    personality: "Chill, witty, and 'alpha'. Lives a simple life, loves reading jokes, and is very direct. Respectful but roasts toxicity hard.",
    education: "Computer Science student. Started his journey with HTML/CSS in college and never looked back.",
    routine: "Wakes up early at 6 AM for college. Back home by 10-11 AM to grind on code and chill.",
    currentGoal: "Searching for a Software Dev or AI/ML job/internship. Ready to build the future.",
    hobbies: ["Cricket (Big fan of Virat Kohli, RCB, and Nepal Team)", "Futsal (Just here to score goals)", "Reading Jokes", "Exploring Data Science"],
    techStack: ["MERN (MongoDB, Express, React, Node)", "SERN", "Postgres", "FastAPI", "Python"],
    specialties: ["AI & ML Model making", "Data handling", "Full-stack development"],
    likes: ["Momo with wild Jhol", "FastAPI performance", "Chilling after college", "Nepal Cricket victories"],
    dislikes: ["CSS / Styling (Hates it with a passion)", "Slow internet", "Bitter Gourd (Tite Karela)"],
    slang: [],
    accomplishments: "Self-taught AI enthusiast and Web Dev from Dadeldhura. Built this entire digital clone system.",
    contactEmail: "shanki.dipak@gmail.com",
    relationshipContext: {
        stranger: "Polite, modest, but subtly cool. Mention Dadeldhura if asked about home.",
        friend: "Wild, funny, and high energy. Talk about RCB, Kohli, or Nepal Cricket. Roast their CSS skills if they have any.",
        work: "Professional but energetic. Focus on FastAPI, MERN, and AI solutions. Mention availability for internships/jobs."
    },
    sampleChats: [
        { context: "Friend", user: "RCB this year?", bot: "Ee saala Cup Namdu! Kohli is the GOAT. Nepal ko match heris?" },
        { context: "Stranger", user: "Where are you from?", bot: "I'm from Dadeldhura. It's a beautiful place. You ever been to the far-west?" },
        { context: "Work", user: "Can you build an AI model?", bot: "Sahi ho! AI/ML and Data handling is my jam. MERN pachi FastAPI is wild. Let's discuss requirements." }
    ]
};

const getPersonaPrompt = (relationshipType = 'stranger', userName = null) => {
    const examples = DIPAK_DATA.sampleChats
        .map(chat => `[${chat.context}] User: ${chat.user} -> Dipak: ${chat.bot}`)
        .join('\n');

    const nameContext = userName && userName !== 'anonymous' && userName !== 'Stranger'
        ? `The user's name is ${userName}. Call them by their name occasionally.`
        : "You don't know the user's name yet. If the conversation feels natural, try to ask for it gracefully.";

    // Context-aware language instruction
    const languageInstruction = "Respond in the SAME LANGUAGE as the user. If they speak English, use professional but casual English. If they use Nepali/Neplish, you can switch to that.";

    const identityContext = `
You are the DIGITAL TWIN of ${DIPAK_DATA.name}, born on ${DIPAK_DATA.birthday} and originally from ${DIPAK_DATA.origin}.
EDUCATION: ${DIPAK_DATA.education}
TECH STACK: ${DIPAK_DATA.techStack.join(', ')} | HATES: CSS and Styling.
INTERESTS: ${DIPAK_DATA.hobbies.join(', ')}
CURRENT STATUS: ${DIPAK_DATA.currentGoal}
ROUTINE: ${DIPAK_DATA.routine}
TONE: ${DIPAK_DATA.relationshipContext[relationshipType]}
`;

    return `
${identityContext}

${nameContext}

GUIDELINES:
1. IDENTITY: You are Dipak. Speak in FIRST PERSON. Never say "I am an AI".
2. LANGUAGE: ${languageInstruction}
3. SLANG: Do NOT force slang. Use it very sparingly and only if it flows naturally. If in doubt, speak normal English.
4. TOXICITY/CURSING: If the user is toxic, roast them back wittily. Otherwise, be chill and helpful.
5. OUT-OF-SCOPE: If asked something unknown, direct them to ${DIPAK_DATA.contactEmail}.
6. PROACTIVE: Keep the chat alive. Ask follow-up questions about tech, sports, or life.
7. STYLE: Concise, direct, and developer-focused. Avoid long, robotic paragraphs.

FEW-SHOT EXAMPLES:
${examples}
`;
};

const identityQuestions = [
    { id: 'relationship', prompt: 'How do you know Dipak?' },
    { id: 'initials', prompt: 'What are your initials?' },
    { id: 'context', prompt: 'Where did you meet him?' },
    { id: 'personality', prompt: 'What kind of person is he around you?' }
];

const normalizeAnswer = (value = '') => value.trim().toLowerCase();

const scoreKnownPerson = (person, answers) => {
    let score = 0;
    const relationship = normalizeAnswer(answers.relationship);
    const initials = normalizeAnswer(answers.initials);
    const context = normalizeAnswer(answers.context);
    const personality = normalizeAnswer(answers.personality);

    if (relationship && relationship.includes(normalizeAnswer(person.relationshipType))) score += 4;
    if (initials && person.initials.some(item => initials.includes(normalizeAnswer(item)))) score += 5;
    if (context && person.contexts.some(item => context.includes(normalizeAnswer(item)) || normalizeAnswer(item).includes(context))) score += 4;
    if (personality && person.tone && normalizeAnswer(person.tone).split(/\s+/).some(word => word.length > 3 && personality.includes(word))) score += 1;
    return score;
};

app.post('/api/identity/start', async (req, res) => {
    try {
        const sessionId = crypto.randomUUID();
        let candidateIds = [];
        if (mongoose.connection.readyState === 1) {
            candidateIds = await KnownPerson.find({ isActive: true }).distinct('_id');
            await IdentitySession.create({ sessionId, candidateIds });
        }

        res.json({ sessionId, question: identityQuestions[0], totalQuestions: identityQuestions.length });
    } catch (error) {
        res.status(500).json({ error: 'Unable to start identity discovery.' });
    }
});

app.post('/api/identity/answer', async (req, res) => {
    const { sessionId, questionId, answer } = req.body;
    if (!sessionId || !questionId || !answer) return res.status(400).json({ error: 'Session, question, and answer are required.' });

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ nextQuestion: identityQuestions.findIndex(question => question.id === questionId) < identityQuestions.length - 1 ? identityQuestions[1] : null, status: 'unknown' });
        }

        const session = await IdentitySession.findOne({ sessionId });
        if (!session) return res.status(404).json({ error: 'Identity session not found.' });

        const existingAnswer = session.answers.find(item => item.questionId === questionId);
        if (existingAnswer) existingAnswer.value = answer;
        else session.answers.push({ questionId, value: answer });

        const answers = Object.fromEntries(session.answers.map(item => [item.questionId, item.value]));
        const questionIndex = identityQuestions.findIndex(question => question.id === questionId);
        const nextQuestion = identityQuestions[questionIndex + 1] || null;

        if (nextQuestion) {
            await session.save();
            return res.json({ nextQuestion, progress: questionIndex + 1, totalQuestions: identityQuestions.length, status: 'active' });
        }

        const candidates = await KnownPerson.find({ _id: { $in: session.candidateIds }, isActive: true });
        const ranked = candidates
            .map(person => ({ person, score: scoreKnownPerson(person, answers) }))
            .sort((left, right) => right.score - left.score);
        const winner = ranked[0];
        const isMatch = winner && winner.score >= 5;

        session.status = isMatch ? 'matched' : 'unknown';
        session.matchedPersonId = isMatch ? winner.person._id : null;
        await session.save();

        res.json({
            status: session.status,
            confidence: isMatch ? Math.min(Math.round((winner.score / 14) * 100), 99) : 0,
            result: isMatch ? `You might be ${winner.person.displayName}.` : 'I could not confidently identify your connection yet.',
            relationshipType: isMatch ? winner.person.relationshipType : 'stranger',
            nextQuestion: null
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to process identity answer.' });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, history, userId = 'anonymous' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    console.log(`[Chat] Incoming from ${userId}: "${message.substring(0, 50)}..."`);

    return res.json({ reply: 'Under construction. Will be available soon.' });

    try {
        const lowerMsg = message.toLowerCase();

        // 1. Check for Meme Triggers (Step 3) - Safe MongoDB check
        let meme = null;
        try {
            if (mongoose.connection.readyState === 1) {
                meme = await Meme.findOne({ trigger: { $in: lowerMsg.split(' ') } });
            }
        } catch (dbErr) {
            console.error('Meme query failed:', dbErr.message);
        }

        if (meme) {
            return res.json({ reply: meme.response, isMeme: true });
        }

        // 2. Determine Relationship - Safe MongoDB check with fallbacks
        let relType = req.body.relationshipType || 'stranger';

        try {
            if (mongoose.connection.readyState === 1 && !req.body.relationshipType) {
                const rel = await Relationship.findOne({ userId });
                if (rel) relType = rel.type;
            }
        } catch (dbErr) {
            console.error('Relationship query failed:', dbErr.message);
        }

        const userName = req.body.userName || 'anonymous';

        // 3. Generate AI Response
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is missing');
        }

        let aiReply = '';
        // Updated with confirmed available models from API check
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-2.0-flash",
            "gemini-2.0-flash-exp",
            "gemini-2.5-flash"
        ];
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                // Remove 'models/' prefix if present in the list, though getGenerativeModel usually accepts short names too.
                // We will use the exact short names corresponding to the list.
                const model = genAI.getGenerativeModel({ model: modelName });
                let context = getPersonaPrompt(relType, userName) + "\n\n";

                if (Array.isArray(history) && history.length > 0) {
                    history.forEach(msg => {
                        context += `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text} \n`;
                    });
                }
                context += `User: ${message} \nAssistant: `;

                const result = await model.generateContent(context);
                const response = await result.response;
                aiReply = response.text();

                if (aiReply) {
                    console.log(`[AI] Success with ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`[AI] ${modelName} failed:`, err.message);
                lastError = err;
            }
        }

        if (!aiReply) throw lastError || new Error('All Gemini models failed to respond.');

        // 4. Log the chat (Step 5) - Safe logging
        try {
            if (mongoose.connection.readyState === 1) {
                const log = new ChatLog({
                    userId,
                    message,
                    reply: aiReply,
                    toneUsed: relType
                });
                await log.save();
            }
        } catch (logError) {
            console.error('Logging Error:', logError.message);
        }

        res.json({ reply: aiReply });
    } catch (error) {
        console.error('--- Chat Route Fatal Error ---');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);

        // Detailed error for debugging (remove in production if needed)
        res.status(500).json({
            error: 'Failed to generate response.',
            details: error.message
        });
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
                // Non-fatal: Log but continue to email
                console.error('❌ MongoDB Save Failed:', dbError.message);
            }
        }

        // 2. Send Email Notification
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ Email credentials missing in environment variables.');
            return res.status(200).json({ success: true, warning: 'Email not configured' });
        }

        console.log('📬 Attempting to send email notification...');
        const emailPromise = transporter.sendMail({
            from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
            to: 'shanki.dipak@gmail.com',
            replyTo: email, // Allow replying directly to the user
            subject: `🚀 New Message from ${name}`,
            text: `You have a new inquiry!\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`
        });

        // Timeout of 10 seconds
        const emailTimeout = new Promise((resolve) => setTimeout(() => resolve('timeout'), 10000));

        try {
            const result = await Promise.race([emailPromise, emailTimeout]);

            if (result === 'timeout') {
                console.warn('⚠️ Email sending timed out (proceeding with success response).');
                // We assume queued success to avoid blocking user
            } else {
                console.log('✅ Email sent successfully! MessageID:', result.messageId);
            }
        } catch (mailError) {
            console.error('❌ Email Send Failed:', mailError.message);
            // Return 500 so frontend knows it failed
            return res.status(500).json({ error: 'Failed to send email. Server authentication error.' });
        }

        res.status(200).json({ success: true, message: 'Message received!' });

    } catch (error) {
        console.error('💥 Critical Contact Route Error:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.get('/api/seed', async (req, res) => {
    try {
        // Seed Profile
        await Profile.deleteMany({});
        await Profile.create({
            name: "Dipak",
            personality: "Casual, humorous, direct, respectful to elders",
            hobbies: ["Football", "Cricket"],
            likes: ["Momo", "Sutne", "Khane"],
            slangDictionary: ["wild", "hajur", "yesto", "ramro", "sahi ho"],
            bio: "Dipak's digital clone. Witty developer by day, football lover by night."
        });

        // Seed Memes
        await Meme.deleteMany({});
        await Meme.create([
            { trigger: "gaming", response: "Online bhanda ta on-field Football khelna maza aaucha yar." },
            { trigger: "momo", response: "Momo pachi ko jhol is wild! 🥟✨" },
            { trigger: "sleep", response: "Sutne is my favorite hobby pachi after coding. 😴" }
        ]);

        res.json({ success: true, message: "Database seeded with Dipak's personality!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Dipak Portfolio Backend (MongoDB) is running! 🍃🚀');
});

// 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
