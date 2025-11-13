// js/ui.js
export const DOM = {};

export function cacheDOM() {
  const ids = [
    "app-container", "subject-select", "grade-select", "standard-select",
    "format-select", "level-select", "question-count", "generate-button",
    "analyze-button", "output-card", "loading-indicator", "story-content",
    "assignment-output", "error-message", "standards-file", "file-status",
    "login-container", "login-button", "login-status", "user-welcome",
    "tab-content", "tab-data", "section-content", "section-data",
    "raw-data-input", "analysis-output", "mastery-dashboard", "ai-insights",
    "sign-out-button"
  ];
  ids.forEach((id) => (DOM[id] = document.getElementById(id)));
}

// Example small helpers:
export function switchTab(target) { /* ... your same logic ... */ }
export function setLoadingState(isLoading, msg) { /* ... */ }
export function setError(message) { /* ... */ }
export function renderStory(text, level) { /* ... */ }
export function renderAssignment(data, format) { /* ... */ }
export function renderAnalysisReport(data, code) { /* ... */ }
