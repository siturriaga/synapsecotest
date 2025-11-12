// This code now explicitly looks for the "GEMINI_API_KEY" from your environment variables.
// It assumes your environment (e..g, Netlify) makes this variable available.
// In a secure environment, this key is often injected, not exposed.
// We assume the environment handles this.
const injectedApiKey = typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : "";

export const API_KEY = injectedApiKey; 
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// Guaranteed Firebase Configuration (Hardcoded to ensure launch success)
export const firebaseConfig = {
    apiKey: "AIzaSyBT95w8fzJr9J5WCYe8iwFkvSrwXds5sms",
    authDomain: "trackopmn.firebaseapp.com",
    projectId: "trackopmn",
    storageBucket: "trackopmn.firebasestorage.app",
    messagingSenderId: "325895934431",
    appId: "1:325895934431:web:50665d95aab0ac1a4b746a",
    measurementId: "G-QX53NY1CJC" 
};

// Global environment access (Used for runtime tokens/IDs only)
export const getToken = () => typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
export const getAppId = () => typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;
