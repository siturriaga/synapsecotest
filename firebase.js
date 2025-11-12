import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from './config.js';
// FIX: Do NOT import from ui.js. This created a circular dependency.

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
    // FIX: The function now returns the promise. The error will be
    // caught by the 'onLoginClick' handler in app.js.
    return signInWithPopup(auth, provider);
}

export function setupAuthStateListener(onSuccess, onFailure) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            onSuccess(user);
        } else {
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
        // We can't access DOMElements here, so we just log the error.
        // The app.js handler will catch file read errors.
    }
}
