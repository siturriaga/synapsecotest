// --- Import All Modules ---
import { API_URL, API_KEY, firebaseConfig } from './config.js';
import { initialStandardsImport } from './curriculum.js';
import { 
    getStoryPrompt, 
    getPayloadAndSchema, 
    getAnalysisPrompt 
} from './ai_logic.js';

// --- Global App State ---
let loadedStandardsData = initialStandardsImport;
let db, auth, userId, appId;
let firebaseReady = false;

// --- DOM Element Cache ---
// (We cache all elements on load for performance)
const DOMElements = {};

function cacheDOMElements() {
    const ids = [
        'app-container', 'subject-select', 'grade-select', 'standard-select', 
        'format-select', 'level-select', 'count-select', 'generate-button', 
        'analyze-button', 'output-card', 'loading-indicator', 'story-content', 
        'assignment-output', 'error-message', 'standards-file', 'file-status', 
        'initialization-status', 'tab-content', 'tab-data', 'section-content', 
        'section-data', 'raw-data-input', 'analysis-output', 'mastery-dashboard', 
        'ai-insights', 'login-container', 'login-button', 'login-status', 'user-welcome'
    ];
    ids.forEach(id => {
        DOMElements[id] = document.getElementById(id);
    });
}

// --- Firebase & Authentication ---

async function initializeFirebase() {
    try {
        const { initializeApp, getAuth, signInWithCustomToken, signInAnonymously, getFirestore, GoogleAuthProvider, signInWithPopup } = window.firebaseExports;

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Handle Google Sign-In
        const googleProvider = new GoogleAuthProvider();
        
        DOMElements['login-button'].addEventListener('click', async () => {
            DOMElements['login-status'].textContent = "Opening Google Sign-in...";
            try {
                const result = await signInWithPopup(auth, googleProvider);
                // This will trigger the onAuthStateChanged listener
            } catch (error) {
                console.error("Google Sign-In Error:", error);
                DOMElements['login-status'].textContent = `Sign-in failed: ${error.message}`;
            }
        });

        // Listen for Auth State Changes
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                userId = user.uid;
                appId = firebaseConfig.appId; // Use the hardcoded config app ID
                firebaseReady = true;

                // Show the main app, hide login
                DOMElements['login-container'].style.display = 'none';
                DOMElements['app-container'].style.display = 'block';
                DOMElements['initialization-status'].style.display = 'block';
                DOMElements['initialization-status'].textContent = "Session Active";
                DOMElements['user-welcome'].textContent = `Welcome, ${user.displayName || 'User'}!`;
                
                // Enable buttons
                DOMElements['generate-button'].disabled = false;
                DOMElements['analyze-button'].disabled = false;
                DOMElements['generate-button'].textContent = 'Generate Differentiated Content';
                DOMElements['analyze-button'].textContent = 'Analyze Data & Generate Report';

                // Load initial data and set up listener
                loadedStandardsData = initialStandardsImport;
                setupStandardsListener();
                populateStandardDropdown();
                populateSubjectDropdown();

            } else {
                // User is signed out
                firebaseReady = false;
                DOMElements['login-container'].style.display = 'block';
                DOMElements['app-container'].style.display = 'none';
                DOMElements['initialization-status'].style.display = 'none';
            }
        });

    } catch (e) {
        console.error("SECURE INITIALIZATION FAILED:", e);
        DOMElements['initialization-status'].textContent = "ERROR: Secure Session Failed.";
    }
}

// --- File Management & Listeners ---

function setupStandardsListener() {
    const { doc, onSnapshot } = window.firebaseExports;
    const standardsRef = doc(db, `users/${userId}/standards/current`); // Private path

    onSnapshot(standardsRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().data) {
            loadedStandardsData = JSON.parse(docSnap.data().data);
            DOMElements['file-status'].textContent = `Custom standards loaded successfully.`;
            DOMElements['file-status'].classList.replace('text-red-500', 'text-green-600');
        } else {
            loadedStandardsData = initialStandardsImport;
            DOMElements['file-status'].textContent = 'Using embedded standards data. Upload a file to save custom data.';
            DOMElements['file-status'].classList.replace('text-red-500', 'text-gray-500'); 
        }
        populateSubjectDropdown();
        populateStandardDropdown();
    }, (error) => {
        console.error("Error listening to standards:", error);
        DOMElements['file-status'].textContent = 'Error loading standards from database.';
    });
}

async function saveStandardsToFirestore(jsonData) {
    if (!firebaseReady) return;
    try {
        const { doc, setDoc } = window.firebaseExports;
        const standardsRef = doc(db, `users/${userId}/standards/current`); // Private path
        await setDoc(standardsRef, {
            data: JSON.stringify(jsonData),
            timestamp: new Date().toISOString()
        });
        console.log("Standards saved to Firestore.");
    } catch (e) {
        console.error("Error saving standards:", e);
        DOMElements['file-status'].textContent = "Error saving file. Check console.";
    }
}

// --- UI Update Functions ---

function populateSubjectDropdown() {
    const subjectSelect = DOMElements['subject-select'];
    const currentSubject = subjectSelect.value;
    subjectSelect.innerHTML = ''; // Clear
    
    Object.keys(loadedStandardsData).forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
    
    // Restore previous selection if it still exists
    if (loadedStandardsData[currentSubject]) {
        subjectSelect.value = currentSubject;
    }
}

function populateStandardDropdown() { 
    const subject = DOMElements['subject-select'].value;
    const standardSelect = DOMElements['standard-select'];
    
    standardSelect.innerHTML = '';
    standardSelect.disabled = true;

    const standardsList = loadedStandardsData[subject] || [];
    
    if (standardsList.length > 0) {
        standardsList.forEach(std => {
            const option = document.createElement('option');
            option.value = std.code;
            // Use desc if available, fallback to name, trim for display
            const desc = std.desc || std.name || 'No Description';
            option.textContent = `${std.code}: ${desc.substring(0, 40)}...`;
            standardSelect.appendChild(option);
        });
        standardSelect.disabled = false;
    } else {
        standardSelect.innerHTML = `<option value="" disabled selected>No standards for ${subject} in file</option>`;
    }
}

function getFullStandardText(standardCode, subject) { 
    const standards = loadedStandardsData[subject];
    if (standards) {
        const standard = standards.find(s => s.code === standardCode);
        if (standard) {
            // Use the most complete text available
            if (standard.full_text) return standard.full_text;
            
            let fullText = standard.name || std.desc;
            if (standard.internal?.clarifications) fullText += " | CLARIFICATIONS: " + standard.internal.clarifications.join('; ');
            if (standard.internal?.objectives) fullText += " | OBJECTIVES: " + standard.internal.objectives.join('; ');
            return fullText;
        }
    }
    return `Standard text not found for ${standardCode}. Generating based on code only.`;
}

// --- API Call Utility ---

async function fetchWithRetries(url, options, maxRetries = 5) { 
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Body: ${errorBody.substring(0, 100)}...`);
            }
            return response;
        } catch (error) {
            if (i === maxRetries - 1) {
                throw new Error(`API failed after ${maxRetries} attempts: ${error.message}`);
            }
            const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// --- Rendering Functions ---

function renderStory(text, level) { 
    let formattedText = text;
    let title = "The Friendly Nag (Story & Context)";
    let visualAid = "";

    if (level === 'ELL') {
        const visualMatch = text.match(/Visual Aid Suggestion:\s*(.*)/i);
        if (visualMatch && visualMatch[1]) {
            visualAid = `<p class="mt-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800">
                <strong>Visual Aid Suggestion for Teacher:</strong> ${visualMatch[1].trim()}
                <span class="block text-xs mt-1">(Use this simple picture to help explain the main idea with minimal language.)</span>
            </p>`;
            formattedText = text.replace(visualMatch[0], '').trim();
        }
        title = "The Friendly Nag (Simple ELL Narrative)";
    }

    DOMElements['story-content'].innerHTML = `
        <h3 class="text-xl font-semibold text-gray-800 mb-3">${title}</h3>
        <div class="p-4 rounded-lg bg-gray-50 text-gray-700">
            ${formattedText.split('\n\n').map(p => `<p class="mb-2">${p}</p>`).join('')}
            ${visualAid}
        </div>
    `;
}

function renderAssignment(data, format) { 
    const assignmentContent = DOMElements['assignment-output'];
    assignmentContent.innerHTML = '';
    let html = `<h3 class="text-xl font-semibold text-gray-800 mb-4">${data.assignmentTitle || data.title || format} <span class="text-sm font-medium text-indigo-500">(${data.level})</span></h3>`;

    const renderQuestionList = (questions, isLonger) => {
        return questions.map((q, index) => {
            let optionsHtml = '';
            let footerHtml = '';
            const qIndex = isLonger ? index + 1 : index + 1;

            if (q.options) {
                optionsHtml = ['A', 'B', 'C', 'D'].map(key => `
                    <li class="p-3 mb-2 rounded-lg transition duration-100 border border-gray-200 ${q.correctAnswer === key ? 'bg-green-50' : ''}">
                        <span class="font-bold mr-2 text-indigo-600">${key}.</span>
                        ${q.options[key]}
                    </li>
                `).join('');
                footerHtml += `<p class="mt-3 text-sm font-medium text-green-700">Correct Answer: ${q.correctAnswer}</p>`;
            } else if (q.requiredLength) {
                footerHtml += `<p class="text-sm text-gray-500 mt-1">Required Length: ${q.requiredLength}</p>`;
            }
            
            if (q.complexity) {
                footerHtml += `<p class="text-sm text-gray-500 mt-1">Complexity: DOK ${q.complexity}</p>`;
            }

            return `
                <div class="p-5 bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
                    <p class="text-lg font-semibold text-gray-800 mb-3">${isLonger ? 'Prompt' : 'Question'} ${qIndex}: ${q.questionText || q.prompt || q.question}</p>
                    ${optionsHtml ? `<ul class="space-y-1 text-gray-700 text-sm list-none">${optionsHtml}</ul>` : ''}
                    ${footerHtml}
                </div>
            `;
        }).join('');
    };

    // --- MCQ Rendering ---
    if (format === 'MCQ' && data.questions) {
        html += `<div class="space-y-6">${renderQuestionList(data.questions, false)}</div>`;
    }

    // --- Concept Map Rendering ---
    else if (format === 'ConceptMap' && data.concepts) {
        html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
        data.concepts.forEach((c, index) => {
            html += `
                <div class="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <p class="text-lg font-bold text-indigo-700 mb-1">${index + 1}. ${c.concept}</p>
                    <p class="text-gray-700">${c.definition}</p>
                </div>
            `;
        });
        html += `</div>`;
    }

    // --- TDQ Rendering ---
    else if (format === 'TDQs' && data.story && data.questions) {
        html += `<div class="p-5 bg-gray-50 rounded-xl mb-6">
                    <h4 class="text-lg font-bold mb-2 text-gray-800">Source Text:</h4>
                    <div class="text-gray-700 whitespace-pre-wrap">${data.story}</div>
                </div>`;
        html += `<div class="space-y-6">${renderQuestionList(data.questions, false)}</div>`;
    }

    // --- Mixed Assignment Rendering ---
    else if (format === 'Mixed' && data.mcqs && data.longerQuestions) {
        html += `<h4 class="text-xl font-bold mt-6 mb-4 text-gray-800">Multiple Choice Questions (Differentiated)</h4>`;
        html += renderQuestionList(data.mcqs, false);

        html += `<h4 class="text-xl font-bold mt-10 mb-4 text-gray-800">Short Answer/Extended Response (Differentiated)</h4>`;
        html += renderQuestionList(data.longerQuestions, true);
    }
    else {
        html = `<p class="text-red-500">Error: Could not render structured data for the selected format. The model may have returned an incorrect structure. (Check console for details)</p>`;
    }
    assignmentContent.innerHTML = html;
}

function renderAnalysisReport(data, standardCode) {
    const getCardClass = (band) => {
        if (band === 'High Mastery') return 'bg-green-100 text-green-800 border-green-500';
        if (band === 'Proficient') return 'bg-indigo-100 text-indigo-800 border-indigo-500';
        if (band === 'Developing') return 'bg-yellow-100 text-yellow-800 border-yellow-500';
        return 'bg-red-100 text-red-800 border-red-500';
    };

    DOMElements['mastery-dashboard'].innerHTML = `
        <div class="p-4 rounded-xl border-l-4 ${getCardClass(data.masteryBand.band)}">
            <p class="text-sm font-medium">Overall Class Mastery Band</p>
            <p class="text-3xl font-bold">${data.masteryBand.band}</p>
            <p class="mt-1">${data.masteryBand.summary}</p>
            <p class="text-xs mt-2">Approximate Average Score: ${data.masteryBand.score}</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-100 border-l-4 border-gray-400 md:col-span-2">
            <p class="text-sm font-medium text-gray-700">Standard Analyzed</p>
            <p class="text-lg font-bold">${standardCode}</p>
            <p class="text-xs mt-1 text-gray-600">Grade ${DOMElements['grade-select'].value} - Subject ${DOMElements['subject-select'].value}</p>
        </div>
    `;

    DOMElements['ai-insights'].innerHTML = `
        <div class="p-5 border border-gray-200 rounded-xl">
            <h4 class="text-lg font-bold text-gray-800 mb-2">General Pedagogical Findings</h4>
            <p class="text-gray-700">${data.generalInsights}</p>
        </div>
        <div class="p-5 border border-gray-200 rounded-xl">
            <h4 class="text-lg font-bold text-gray-800 mb-2">Specific Class Deficits (Fuzzy Concepts/Variations)</h4>
            <p class="text-gray-700">${data.classFindings}</p>
        </div>
        <div class="p-5 border border-gray-200 rounded-xl">
            <h4 class="text-lg font-bold text-gray-800 mb-2">Actionable Remediation Recommendations</h4>
            <p class="text-gray-700">${data.pedagogicalRecommendations}</p>
        </div>
        <div class="p-5 border border-gray-200 rounded-xl">
            <h4 class="text-lg font-bold text-red-700 mb-2">Individual Intervention Flags</h4>
            <p class="text-red-700">${data.individualFlags}</p>
        </div>
    `;
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

// --- Helper: Set Loading/Error States ---
function setLoadingState(isLoading, message = "Generating...") {
    if (isLoading) {
        DOMElements['loading-indicator'].classList.remove('hidden');
        DOMElements['loading-indicator'].querySelector('p').textContent = message;
        DOMElements['error-message'].classList.add('hidden');
        DOMElements['story-content'].innerHTML = '';
        DOMElements['assignment-output'].innerHTML = '';
        DOMElements['analysis-output'].classList.add('hidden');
        DOMElements['generate-button'].disabled = true;
        DOMElements['analyze-button'].disabled = true;
    } else {
        DOMElements['loading-indicator'].classList.add('hidden');
        DOMElements['generate-button'].disabled = false;
        DOMElements['analyze-button'].disabled = false;
        DOMElements['generate-button'].textContent = 'Generate Differentiated Content';
        DOMElements['analyze-button'].textContent = 'Analyze Data & Generate Report';
    }
}

function setErrorMessage(message) {
    DOMElements['error-message'].textContent = message;
    DOMElements['error-message'].classList.remove('hidden');
}


// --- Main Event Handlers (Initialization) ---

function initializeApp() {
    // Cache all DOM elements
    cacheDOMElements();

    // Attach all event listeners
    DOMElements['tab-content'].addEventListener('click', () => switchTab('content'));
    DOMElements['tab-data'].addEventListener('click', () => switchTab('data'));
    DOMElements['subject-select'].addEventListener('change', populateStandardDropdown);
    DOMElements['standards-file'].addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !firebaseReady) return;
        const reader = new FileReader();
        reader.onload = (e_load) => {
            try {
                const jsonData = JSON.parse(e_load.target.result);
                if (typeof jsonData !== 'object' || Array.isArray(jsonData)) {
                     throw new Error("Invalid JSON structure. Must be an object of subjects.");
                }
                saveStandardsToFirestore(jsonData);
            } catch (error) {
                DOMElements['file-status'].textContent = `File Error: ${error.message}`;
            }
        };
        reader.readAsText(file);
    });

    // Attach Content Generator Button
    DOMElements['generate-button'].addEventListener('click', handleGenerateContent);
    
    // Attach Data Analyzer Button
    DOMElements['analyze-button'].addEventListener('click', handleAnalyzeData);

    // Start Firebase Auth
    initializeFirebase();
}

// --- Main Event Handlers (Generation Logic) ---

async function handleGenerateContent() {
    if (!firebaseReady) { setErrorMessage('ERROR: Secure session not active.'); return; }
    
    const { standardCode, subject, gradeLevel, format, level, count } = getInputs();

    if (!standardCode) { setErrorMessage('Please select a standard code.'); return; }

    setLoadingState(true, 'Generating... (Step 1 of 2: Story)');
    DOMElements['output-card'].classList.remove('hidden');

    try {
        const fullStandardText = getFullStandardText(standardCode, subject);
        const storyInstructions = getStoryPrompt(standardCode, level, gradeLevel, fullStandardText); 
        
        let storyPayload = {
            contents: [{ parts: [{ text: storyInstructions.user }] }],
            systemInstruction: { parts: [{ text: storyInstructions.system }] }
        };

        let response = await fetchWithRetries(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storyPayload)
        });

        let result = await response.json();
        let storyText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Could not generate narrative context.";
        renderStory(storyText, level);

        setLoadingState(true, 'Generating... (Step 2 of 2: Assignment)');

        const { payload } = getPayloadAndSchema(standardCode, format, level, count, gradeLevel, fullStandardText); 

        response = await fetchWithRetries(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        result = await response.json();
        const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonString) {
            throw new Error("Model failed to return structured JSON for the assignment.");
        }

        const assignmentData = JSON.parse(jsonString);
        renderAssignment(assignmentData, format);

    } catch (error) {
        console.error("Gemini API Error:", error);
        setErrorMessage(`Error generating content: ${error.message}. Ensure inputs are correct.`);
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
    DOMElements['output-card'].classList.remove('hidden'); // Show the output card
    DOMElements['analysis-output'].classList.remove('hidden'); // Show the analysis section

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

        const response = await fetchWithRetries(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analysisPayload)
        });

        const result = await response.json();
        const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonString) {
            throw new Error("Model failed to return structured JSON for the analysis.");
        }

        const analysisData = JSON.parse(jsonString);
        renderAnalysisReport(analysisData, standardCode);

    } catch (error) {
        console.error("Gemini API Error (Analysis):", error);
        setErrorMessage(`Error during analysis: ${error.message}. Check network and data format.`);
    } finally {
        setLoadingState(false);
    }
}

// --- App Entry Point ---
initializeApp();
