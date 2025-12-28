import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Using API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
        // Using correct listModels call
        // Note: listModels is not a function on the instance in newer SDKs sometimes, 
        // usually it's genAI.getGenerativeModel... but for listing we might need a different approach or just test generating.
        // Let's try to generate with a very standard model to see if it works at all.

        const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

        for (const name of modelNames) {
            console.log(`Testing ${name}...`);
            try {
                const model = genAI.getGenerativeModel({ model: name });
                const result = await model.generateContent("Test");
                const response = await result.response;
                console.log(`SUCCESS: ${name} responded: ${response.text()}`);
                return; // Found one!
            } catch (e) {
                console.log(`FAILED: ${name} - ${e.message}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
