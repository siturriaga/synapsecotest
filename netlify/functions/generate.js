// This function runs on Netlify's servers, not in the browser.
// It can safely access your private GEMINI_API_KEY.

// This is the Google API endpoint.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=';

export async function handler(event, context) {
    // 1. Check if the request is a POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed. Must be a POST request.',
        };
    }

    try {
        // 2. Get the API key from Netlify's private environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in Netlify environment.");
        }

        // 3. Get the payload (the prompt, schema, etc.) from the app's request
        const payload = JSON.parse(event.body);

        // 4. Securely call the Gemini API from the server
        const response = await fetch(GEMINI_API_URL + GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API Error: ${response.status} ${errorBody}`);
        }

        const data = await response.json();
        
        // 5. Send the successful response back to the app
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('Error in Netlify function:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
