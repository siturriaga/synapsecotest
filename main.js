import { initializeApp } from './app.js';

// This is the crucial fix: Wait for the DOM to be fully loaded before
// trying to find elements or attach event listeners.
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
