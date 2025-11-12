// This file holds the application configuration.

// 1. Gemini API Key (Hardcoded for stability)
//    If this key is exposed, you MUST enable domain restrictions in your Google Cloud dashboard.
export const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE"; // <-- PASTE YOUR KEY HERE
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// 2. Firebase Configuration (Hardcoded from your input for guaranteed launch)
export const firebaseConfig = {
    apiKey: "AIzaSyBT95w8fzJr9J5WCYe8iwFkvSrwXds5sms",
    authDomain: "trackopmn.firebaseapp.com",
    projectId: "trackopmn",
    storageBucket: "trackopmn.firebasestorage.app",
    messagingSenderId: "325895934431",
    appId: "1:325895934431:web:50665d95aab0ac1a4b746a",
    measurementId: "G-QX53NY1CJC"
};
