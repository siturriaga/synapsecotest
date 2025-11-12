export const API_KEY = ""; // Environment variable must inject key here
export const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";

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

// Global environment access (Used for secure tokens only)
export const getToken = () => typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
export const getAppId = () => typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;
