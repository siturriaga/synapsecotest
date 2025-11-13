// js/firebaseClient.js
const firebaseConfig = {
  apiKey: "AIzaSyBT95w8fzJr9J5WCYe8iwFkvSrwXds5sms",
  authDomain: "trackopmn.firebaseapp.com",
  projectId: "trackopmn",
  storageBucket: "trackopmn.firebasestorage.app",
  messagingSenderId: "325895934431",
  appId: "1:325895934431:web:50665d95aab0ac1a4b746a",
  measurementId: "G-QX53NY1CJC"
};

let auth;
let db;

export function initFirebase() {
  const app = window.firebase.initializeApp(firebaseConfig);
  auth = window.firebase.getAuth(app);
  db = window.firebase.getFirestore(app);
}

export function googleSignIn() {
  const provider = new window.firebase.GoogleAuthProvider();
  return window.firebase.signInWithPopup(auth, provider);
}

export function signOutUser() {
  return window.firebase.signOut(auth);
}

export function onAuthChange(onSuccess, onFailure) {
  window.firebase.onAuthStateChanged(auth, (user) => {
    if (user) onSuccess(user);
    else onFailure();
  });
}

export function listenToStandards(userId, onUpdate) {
  const standardsRef = window.firebase.doc(db, `users/${userId}/standards/current`);
  return window.firebase.onSnapshot(
    standardsRef,
    (docSnap) => {
      if (docSnap.exists() && docSnap.data().data) {
        onUpdate(JSON.parse(docSnap.data().data));
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error("Error listening to standards:", err);
      onUpdate(null);
    }
  );
}

export async function saveStandards(userId, jsonData) {
  const standardsRef = window.firebase.doc(db, `users/${userId}/standards/current`);
  await window.firebase.setDoc(standardsRef, {
    data: JSON.stringify(jsonData),
    timestamp: new Date().toISOString(),
  });
}
