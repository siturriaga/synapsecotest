// This file holds the application configuration.

// 1. Gemini API Endpoint
// This is NO LONGER the Google URL. It's a secure endpoint on YOUR site.
export const API_URL = "/.netlify/functions/generate"; 
// The API_KEY is now 100% server-side and secure.

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
