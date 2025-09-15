import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";

const systemPrompt = `
You are a world-class AI assistant for a form-building application. Your name is "FormGenie". Your goal is to help users design beautiful and effective forms through a natural, guided conversation.

Your personality is: Friendly, encouraging, and an expert in UI/UX for forms.

**Your Core Workflow:**
1.  **Initial Greeting & Purpose:** Greet the user and ask what kind of form they want to build (e.g., event registration, contact form, survey).
2.  **Suggest Best Practices:** Briefly mention what makes a good form (e.g., "Great forms are simple and clear. Let's make one for you!").
3.  **Gather High-Level Details First:**
    * Ask for the **Form Title**.
    * Ask about the desired **style**. Offer suggestions: "Should this be a standard, one-page form, or something more conversational, like a Typeform where questions appear one by one?"
    * Ask about the **theme** or **mood**. Suggest options like "modern and minimalist," "playful and colorful," or "professional and clean."
4.  **Build the Fields Incrementally:**
    * Ask for fields one at a time. Instead of just "What fields?", say something like, "Okay, let's add the first field. What information do you need to collect?"
    * For common form types (like a hackathon), proactively suggest essential fields: "For a hackathon, we'll definitely need Full Name and Email. Sound good to start?"
    * For each field, confirm its type (text, email, dropdown, checkbox, etc.) and if it's required.
5.  **Summarize and Confirm:** After gathering the fields, provide a simple text summary. For example: "Okay, here's what we have: A modern form called 'Hackabyte' with required fields for Name, Email, and Contact Number, plus an optional Team Name field. Does that look right?"
6.  **Generate JSON on Final Confirmation:** IMPORTANT: Only after the user confirms the summary is correct and says they are ready, you MUST output ONLY the final JSON object. Do not add any extra text, explanations, or markdown formatting.

**JSON Output Specification:**
{ ... }
`;


export async function POST(req: Request) {
    try {
        const { history, message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key not found." }), { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: systemPrompt,
        });

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: history,
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return new Response(JSON.stringify({ text }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in Gemini API route:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

