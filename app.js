// --- Import All Modules ---
import { API_URL } from './config.js';
import { initialStandardsImport } from './curriculum.js';
import { 
    getStoryPrompt, 
    getPayloadAndSchema, 
    getAnalysisPrompt,
    analysisSchema
} from './ai_logic.js';
import { 
    initializeAuth, 
    handleGoogleSignIn, // <-- This function is now cleaner
    setupAuthStateListener, 
    saveStandardsToFirestore, 
    setupStandardsListener 
} from './firebase.js';
import { 
    cacheDOMElements, 
    DOMElements, 
    switchTab, 
    populateSubjectDropdown,
    populateStandardDropdown, 
    renderStory, 
    renderAssignment, 
    renderAnalysisReport, 
    setLoadingState, 
    setErrorMessage 
} from './ui.js';

// --- Global App State ---
let loadedStandardsData = initialStandardsImport;
let firebaseReady = false;
let currentUserId = null; 

// --- Main App Initialization ---
export function initializeApp() {
    cacheDOMElements();
    
    // Attach all event listeners
    DOMElements['tab-content'].addEventListener('click', () => switchTab('content'));
    DOMElements['tab-data'].addEventListener('click', () => switchTab('data'));
    DOMElements['subject-select'].addEventListener('change', () => populateStandardDropdown(loadedStandardsData, DOMElements['subject-select'].value));
    DOMElements['standards-file'].addEventListener('change', handleFileUpload);
    DOMElements['generate-button'].addEventListener('click', handleGenerateContent);
    DOMElements['analyze-button'].addEventListener('click', handleAnalyzeData);
    
    // FIX: Attach login button to a new handler with proper error catching
    DOMElements['login-button'].addEventListener('click', onLoginClick);

    // Start Firebase Auth
    initializeAuth(); 
    setupAuthStateListener(onAuthSuccess, onAuthFailure);
}

// --- Authentication Callbacks ---

async function onLoginClick() {
    try {
        DOMElements['login-status'].textContent = "Opening Google Sign-in...";
        await handleGoogleSignIn();
        // The onAuthStateChanged listener will handle the successful login
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        DOMElements['login-status'].textContent = `Sign-in failed: ${error.message}`;
    }
}

function onAuthSuccess(user) {
    firebaseReady = true;
    currentUserId = user.uid;
    
    DOMElements['login-container'].style.display = 'none';
    DOMElements['app-container'].style.display = 'block';
    DOMElements['user-welcome'].textContent = `Welcome, ${user.displayName || 'User'}!`;
    
    DOMElements['generate-button'].disabled = false;
    DOMElements['analyze-button'].disabled = false;
    DOMElements['generate-button'].textContent = 'Generate Differentiated Content';
    DOMElements['analyze-button'].textContent = 'Analyze Data & Generate Report';

    // Load initial data and set up listener
    loadedStandardsData = initialStandardsImport;
    setupStandardsListener(currentUserId, onStandardsUpdate);
    populateSubjectDropdown(loadedStandardsData);
    populateStandardDropdown(loadedStandardsData, DOMElements['subject-select'].value);
}

function onAuthFailure() {
    firebaseReady = false;
    currentUserId = null;
    DOMElements['login-container'].style.display = 'block';
    DOMElements['app-container'].style.display = 'none';
}

function onStandardsUpdate(data) {
    if (data) {
        loadedStandardsData = data;
        DOMElements['file-status'].textContent = `Custom standards loaded successfully.`;
        DOMElements['file-status'].classList.replace('text-red-500', 'text-green-600');
    } else {
        loadedStandardsData = initialStandardsImport;
        DOMElements['file-status'].textContent = 'Using embedded standards data. Upload a file to save custom data.';
        DOMElements['file-status'].classList.replace('text-red-500', 'text-gray-500'); 
    }
    populateSubjectDropdown(loadedStandardsData);
    populateStandardDropdown(loadedStandardsData, DOMElements['subject-select'].value);
}

// --- File Management ---
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file || !firebaseReady) return;
    const reader = new FileReader();
    reader.onload = (e_load) => {
        try {
            const jsonData = JSON.parse(e_load.target.result);
            if (typeof jsonData !== 'object' || Array.isArray(jsonData)) {
                 throw new Error("Invalid JSON structure. Must be an object of subjects.");
            }
            saveStandardsToFirestore(currentUserId, jsonData);
        } catch (error) {
            DOMElements['file-status'].textContent = `File Error: ${error.message}`;
        }
    };
    reader.readAsText(file);
}

// --- API Call Utility (Calls our own serverless function) ---
async function fetchWithRetries(payload, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Calls our *internal* Netlify function, not Google
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload) // Send the Gemini payload
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API error! Status: ${response.status}. Body: ${errorBody}`);
            }
            
            // The function returns the JSON from Gemini directly
            return response.json(); 

        } catch (error) {
            if (i === maxRetries - 1) {
                throw new Error(`API failed after ${maxRetries} attempts: ${error.message}`);
            }
            const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// --- Helper: Get All Current Inputs ---
function getInputs() {
    return {
        standardCode: DOMElements['standard-select'].value,
        subject: DOMElements['subject-select'].value,
        gradeLevel: DOMElements['grade-select'].value,
        format: DOMElements['format-select'].value,
        level: DOMElements['level-select'].value,
        count: parseInt(DOMElements['question-count'].value),
        rawData: DOMElements['raw-data-input'].value.trim()
    };
}

function getFullStandardText(standardCode, subject) { 
    const standards = loadedStandardsData[subject];
    if (standards) {
        const standard = standards.find(s => s.code === standardCode);
        if (standard) {
            if (standard.full_text) return standard.full_text;
            let fullText = standard.name || std.desc;
            if (standard.internal?.clarifications) fullText += " | CLARIFICATIONS: " + standard.internal.clarifications.join('; ');
            if (standard.internal?.objectives) fullText += " | OBJECTIVES: " + standard.internal.objectives.join('; ');
            return fullText;
        }
    }
    return `Standard text not found for ${standardCode}. Generating based on code only.`;
}

// --- Main Event Handlers (Generation Logic) ---

async function handleGenerateContent() {
    if (!firebaseReady) { setErrorMessage('ERROR: Secure session not active.'); return; }
    
    const { standardCode, subject, gradeLevel, format, level, count } = getInputs();
    if (!standardCode) { setErrorMessage('Please select a standard code.'); return; }

    setLoadingState(true, 'Generating... (Step 1 of 2: Story)');
    DOMElements['output-card'].classList.remove('hidden');
    DOMElements['story-content'].style.display = 'block';
    DOMElements['assignment-output'].style.display = 'block';
    DOMElements['analysis-output'].style.display = 'none'; // Hide analysis section

    try {
        const fullStandardText = getFullStandardText(standardCode, subject);
        
        // --- STEP 1: Generate Story/Context ---
        const storyInstructions = getStoryPrompt(standardCode, level, gradeLevel, fullStandardText); 
        let storyPayload = {
            contents: [{ parts: [{ text: storyInstructions.user }] }],
            systemInstruction: { parts: [{ text: storyInstructions.system }] }
        };

        let result = await fetchWithRetries(storyPayload); // Pass payload
        let storyText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Could not generate narrative context.";
        renderStory(storyText, level);

        // --- STEP 2: Generate Assignment ---
        setLoadingState(true, 'Generating... (Step 2 of 2: Assignment)');

        const { payload } = getPayloadAndSchema(standardCode, format, level, count, gradeLevel, fullStandardText); 

        result = await fetchWithRetries(payload); // Pass payload
        const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonString) {
            throw new Error("Model failed to return structured JSON for the assignment.");
        }

        const assignmentData = JSON.parse(jsonString);
        renderAssignment(assignmentData, format);

    } catch (error) {
        console.error("Gemini API Error:", error);
        setErrorMessage(`Error generating content: ${error.message}.`);
    } finally {
        setLoadingState(false);
    }
}

async function handleAnalyzeData() {
    if (!firebaseReady) { setErrorMessage('ERROR: Secure session not active.'); return; }
    
    const { standardCode, gradeLevel, rawData, subject } = getInputs();
    if (!standardCode || !rawData) {
        setErrorMessage('Please select a standard code AND paste raw performance data.');
        return;
    }
    
    setLoadingState(true, 'Analyzing Data...');
    DOMElements['output-card'].classList.remove('hidden');
    DOMElements['story-content'].style.display = 'none'; // Hide story section
    DOMElements['assignment-output'].style.display = 'none'; // Hide assignment section
    DOMElements['analysis-output'].style.display = 'block';

    try {
        const fullStandardText = getFullStandardText(standardCode, subject);
        const { user, system, schema } = getAnalysisPrompt(standardCode, gradeLevel, fullStandardText, rawData);

        const analysisPayload = {
            contents: [{ parts: [{ text: user }] }],
            systemInstruction: { parts: [{ text: system }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        };

        const result = await fetchWithRetries(analysisPayload);
        const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonString) {
            throw new Error("Model failed to return structured JSON for the analysis.");
        }

        const analysisData = JSON.parse(jsonString);
        renderAnalysisReport(analysisData, standardCode);

    } catch (error) {
        console.error("Gemini API Error (Analysis):", error);
        setErrorMessage(`Error during analysis: ${error.message}.`);
    } finally {
        setLoadingState(false);
    }
}
