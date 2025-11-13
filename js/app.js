// js/app.js
import { initFirebase, googleSignIn, signOutUser, onAuthChange, listenToStandards, saveStandards } from "./firebaseClient.js";
import { initialStandardsImport } from "./standardsData.js";
import { cacheDOM, DOM, switchTab, setLoadingState, setError, renderStory, renderAssignment, renderAnalysisReport } from "./ui.js";
import { callGemini } from "./aiClient.js";
// import your schemas & prompt builders too (aiSchemas.js) …

let firebaseReady = false;
let currentUserId = null;
let loadedStandardsData = initialStandardsImport;

document.addEventListener("DOMContentLoaded", () => {
  cacheDOM();

  // Tabs
  DOM["tab-content"].addEventListener("click", () => switchTab("content"));
  DOM["tab-data"].addEventListener("click", () => switchTab("data"));

  // File upload, generate, analyze, auth buttons...
  DOM["login-button"].addEventListener("click", onLoginClick);
  DOM["sign-out-button"].addEventListener("click", onSignOutClick);
  DOM["generate-button"].addEventListener("click", handleGenerateContent);
  DOM["analyze-button"].addEventListener("click", handleAnalyzeData);
  DOM["standards-file"].addEventListener("change", handleFileUpload);

  // Firebase
  initFirebase();
  onAuthChange(onAuthSuccess, onAuthFailure);
});

async function onLoginClick() {
  try {
    DOM["login-status"].textContent = "Opening Google Sign-in...";
    await googleSignIn();
  } catch (e) {
    DOM["login-status"].textContent = `Sign-in failed: ${e.message}`;
  }
}

async function onSignOutClick() {
  await signOutUser();
}

function onAuthSuccess(user) {
  firebaseReady = true;
  currentUserId = user.uid;
  // same UI toggles you already have…
  listenToStandards(currentUserId, onStandardsUpdate);
}

function onAuthFailure() {
  firebaseReady = false;
  currentUserId = null;
  // toggle back to login view
}

function onStandardsUpdate(data) {
  loadedStandardsData = data || initialStandardsImport;
  // repopulate dropdowns...
}

// handleGenerateContent, handleAnalyzeData call:
// 1) build prompts & schemas
// 2) callGemini(payload)
// 3) renderStory / renderAssignment / renderAnalysisReport
