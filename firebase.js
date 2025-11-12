import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from './config.js';
import { DOMElements } from './ui.js'; // <-- FIX: Import the UI elements

let auth;
let db;

// FIX: Renamed to initializeAuth to avoid naming conflict
export function initializeAuth() {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}

export function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
        console.error("Google Sign-In Error:", error);
        // FIX: Use the shared DOMElements object instead of document.getElementById
        if (DOMElements['login-status']) {
            DOMElements['login-status'].textContent = `Sign-in failed: ${error.message}`;
        }
    });
}

export function setupAuthStateListener(onSuccess, onFailure) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, pass the user object to the app
            onSuccess(user);
        } else {
            // User is signed out
            onFailure();
        }
    });
}

export function setupStandardsListener(userId, onUpdate) {
    // This path is private to the user: /users/USER_ID/standards/current
    const standardsRef = doc(db, `users/${userId}/standards/current`);

    onSnapshot(standardsRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().data) {
            onUpdate(JSON.parse(docSnap.data().data));
        } else {
            onUpdate(null); // No custom data, app will use embedded data
        }
    }, (error) => {
        console.error("Error listening to standards:", error);
        onUpdate(null);
    });
}

export async function saveStandardsToFirestore(userId, jsonData) {
    try {
        const standardsRef = doc(db, `users/${userId}/standards/current`);
        await setDoc(standardsRef, {
            data: JSON.stringify(jsonData),
            timestamp: new Date().toISOString()
        });
        console.log("Standards saved to Firestore.");
    } catch (e) {
        console.error("Error saving standards:", e);
        if (DOMElements['file-status']) {
            DOMElements['file-status'].textContent = "Error saving file. Check console.";
        }
    }
}
