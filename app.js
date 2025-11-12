import { API_KEY, API_URL, firebaseConfig, getToken, getAppId } from './config.js';
import { initialStandardsImport } from './data.js';
import { 
    getStoryPrompt, getAssignmentInstructions, getAnalysisPrompt, fetchGeminiContent, 
    renderStory, renderAssignment, renderAnalysisReport,
    quizSchema, conceptMapSchema, tdqSchema, mixedSchema, analysisSchema
} from './ai_logic.js';


// --- Firebase Globals (Provided by index.html script module export) ---
const { initializeApp, getAuth, signInWithCustomToken, signInAnonymously, getFirestore, doc, setDoc, onSnapshot } = window.firebaseExports;


// --- Utilities ---

export async function fetchWithRetries(url, options, maxRetries = 5) {
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

function getFullStandardText(standardCode, subject, standardsData) { 
    const standards = standardsData[subject];
    if (standards) {
        const standard = standards.find(s => s.code === standardCode);
        if (standard) {
            let fullText = standard.name;
            if (standard.internal?.clarifications) fullText += " | CLARIFICATIONS: " + standard.internal.clarifications.join('; ');
            if (standard.internal?.objectives) fullText += " | OBJECTIVES: " + standard.internal.objectives.join('; ');
            return fullText;
        }
    }
    return `Standard text not found for ${standardCode}. Generating based on code only.`;
}

// --- Global State ---
let db, auth, userId, firebaseReady = false;
let loadedStandardsData = initialStandardsImport;
let currentAppId = getAppId();


// --- DOM Elements ---
const getDomElements = () => ({
    appContainer: document.getElementById('app-container'),
    subjectSelect: document.getElementById('subject-select'),
    gradeSelect: document.getElementById('grade-select'),
    standardSelect: document.getElementById('standard-select'),
    formatSelect: document.getElementById('format-select'),
    levelSelect: document.getElementById('level-select'),
    countSelect: document.getElementById('question-count'),
    generateButton: document.getElementById('generate-button'),
    analyzeButton: document.getElementById('analyze-button'),
    outputCard: document.getElementById('output-card'),
    loadingIndicator: document.getElementById('loading-indicator'),
    storyContent: document.getElementById('story-content'),
    assignmentContent: document.getElementById('assignment-content'),
    errorMessageElement: document.getElementById('error-message'),
    standardsFile: document.getElementById('standards-file'),
    fileStatus: document.getElementById('file-status'),
    initStatus: document.getElementById('initialization-status'),
    tabContent: document.getElementById('tab-content'),
    tabData: document.getElementById('tab-data'),
    sectionContent: document.getElementById('section-content'),
    sectionData: document.getElementById('section-data'),
    rawDataInput: document.getElementById('raw-data-input'),
    masteryDashboard: document.getElementById('mastery-dashboard'),
    aiInsights: document.getElementById('ai-insights'),
});
let DOMElements = {};


// --- UI Initialization and Handlers ---

function populateStandardDropdown() {
    const { subjectSelect, standardSelect } = DOMElements;
    const subject = subjectSelect.value;
    
    standardSelect.innerHTML = '';
    standardSelect.disabled = true;

    const standardsList = loadedStandardsData[subject] || [];
    
    if (standardsList.length > 0) {
        standardsList.forEach(std => {
            const option = document.createElement('option');
            option.value = std.code;
            option.textContent = `${std.code}: ${std.desc ? std.desc.substring(0, 40) + '...' : std.name.substring(0, 40) + '...'}`;
            standardSelect.appendChild(option);
        });
        standardSelect.disabled = false;
    } else {
        standardSelect.innerHTML = `<option value="" disabled selected>No standards for ${subject} in file</option>`;
    }
}

function setupStandardsListener() {
    const standardsRef = doc(db, `artifacts/${currentAppId}/users/${userId}/standards/current`);

    onSnapshot(standardsRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().data) {
            loadedStandardsData = JSON.parse(docSnap.data().data);
            populateStandardDropdown();
            DOMElements.fileStatus.textContent = `Standards loaded successfully from Firestore.`;
            DOMElements.fileStatus.classList.replace('text-red-500', 'text-green-600');
        } else {
            populateStandardDropdown();
            DOMElements.fileStatus.textContent = 'Using embedded standards data. Upload a file to save custom data.';
            DOMElements.fileStatus.classList.replace('text-red-500', 'text-gray-500'); 
        }
    }, (error) => {
        console.error("Error listening to standards:", error);
        DOMElements.fileStatus.textContent = 'Error loading standards from database.';
    });
}

// --- Core Application Execution ---

async function initializeApp() {
    DOMElements = getDomElements();

    try {
        // 1. Firebase Auth
        const token = getToken();
        
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        DOMElements.initStatus.textContent = "Authenticating...";

        if (token) {
            await signInWithCustomToken(auth, token);
        } else {
            await signInAnonymously(auth);
        }
        userId = auth.currentUser?.uid || 'anonymous-user';

        // 2. Load Data
        setupStandardsListener();

        // 3. Set UI Ready State
        firebaseReady = true;
        DOMElements.initStatus.textContent = "Session Active";
        DOMElements.appContainer.classList.remove('hidden');
        DOMElements.generateButton.disabled = false;
        DOMElements.analyzeButton.disabled = false;
        DOMElements.generateButton.textContent = 'Generate Differentiated Content';
        DOMElements.analyzeButton.textContent = 'Analyze Data & Generate Report';
        
        // 4. Setup Event Listeners
        DOMElements.subjectSelect.addEventListener('change', populateStandardDropdown);
        DOMElements.gradeSelect.addEventListener('change', populateStandardDropdown);
        DOMElements.generateButton.addEventListener('click', handleGenerateContent);
        DOMElements.analyzeButton.addEventListener('click', handleAnalyzeData);
        DOMElements.standardsFile.addEventListener('change', handleFileUpload);


    } catch (e) {
        console.error("SECURE INITIALIZATION FAILED:", e);
        DOMElements.initStatus.textContent = "ERROR: Secure Session Failed.";
        DOMElements.fileStatus.textContent = "SECURE ERROR: Content generation disabled. Check console for details.";
    }
}


// --- Main Event Handlers ---

async function handleGenerateContent() {
    const { subjectSelect, standardSelect, formatSelect, levelSelect, countSelect, gradeSelect } = DOMElements;
    const inputs = {
        subject: subjectSelect.value,
        standardCode: standardSelect.value,
        format: formatSelect.value,
        level: levelSelect.value,
        count: parseInt(countSelect.value),
        grade: gradeSelect.value
    };

    if (!inputs.standardCode || inputs.standardCode === "" || inputs.standardCode === "PLACEHOLDER") { 
        DOMElements.errorMessageElement.textContent = 'Please select a standard code.'; 
        DOMElements.errorMessageElement.classList.remove('hidden'); 
        return;
    }

    DOMElements.errorMessageElement.classList.add('hidden');
    DOMElements.outputCard.classList.remove('hidden');
    DOMElements.loadingIndicator.classList.remove('hidden');
    DOMElements.generateButton.disabled = true;
    DOMElements.generateButton.textContent = 'Generating... (Step 1 of 2: Story)';
    DOMElements.masteryDashboard.innerHTML = '';
    DOMElements.aiInsights.innerHTML = '';
    DOMElements.storyContent.innerHTML = '';
    DOMElements.assignmentContent.innerHTML = '';


    try {
        const fullStandardText = getFullStandardText(inputs.standardCode, inputs.subject, loadedStandardsData);
        
        // --- STEP 1: Generate Story/Context ---
        const storyInstructions = getStoryPrompt(inputs.standardCode, inputs.level, inputs.grade, fullStandardText); 
        let storyResult = await fetchGeminiContent(storyInstructions, {type: "STRING"}, API_KEY);
        const storyText = storyResult.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Could not generate narrative context.";
        renderStory(storyText, inputs.level);

        // --- STEP 2: Generate Assignment (Structured JSON) ---
        DOMElements.generateButton.textContent = 'Generating... (Step 2 of 2: Assignment)';

        const instructions = getAssignmentInstructions(inputs.standardCode, inputs.format, inputs.level, inputs.count, inputs.grade, fullStandardText);
        let schemaFunc;
        switch (inputs.format) {
            case 'MCQ': schemaFunc = quizSchema(inputs.count); break;
            case 'ConceptMap': schemaFunc = conceptMapSchema(inputs.count); break;
            case 'TDQs': schemaFunc = tdqSchema(inputs.count); break;
            case 'Mixed': schemaFunc = mixedSchema(inputs.count); break;
        }

        const assignmentData = await fetchGeminiContent(instructions, schemaFunc, API_KEY);
        
        renderAssignment(assignmentData, inputs.format);

    } catch (error) {
        console.error("Gemini API Error:", error);
        DOMElements.errorMessageElement.textContent = `Error generating content: ${error.message}. Ensure API key and standard are correct.`;
        DOMElements.errorMessageElement.classList.remove('hidden');
    } finally {
        DOMElements.loadingIndicator.classList.add('hidden');
        DOMElements.generateButton.disabled = false;
        DOMElements.generateButton.textContent = 'Generate Differentiated Content';
    }
}

async function handleAnalyzeData() {
    const { subjectSelect, standardSelect, gradeSelect, rawDataInput } = DOMElements;
    const inputs = {
        subject: subjectSelect.value,
        standardCode: standardSelect.value,
        grade: gradeSelect.value,
        rawData: rawDataInput.value.trim()
    };

    if (!inputs.standardCode || inputs.standardCode === "" || !inputs.rawData) {
        DOMElements.errorMessageElement.textContent = 'Please select a standard code AND paste raw performance data.';
        DOMElements.errorMessageElement.classList.remove('hidden');
        return;
    }
    
    DOMElements.errorMessageElement.classList.add('hidden');
    DOMElements.outputCard.classList.remove('hidden');
    DOMElements.loadingIndicator.classList.remove('hidden');
    DOMElements.analyzeButton.disabled = true;
    DOMElements.analyzeButton.textContent = 'Analyzing Data...';

    try {
        const fullStandardText = getFullStandardText(inputs.standardCode, inputs.subject, loadedStandardsData);
        const prompt = getAnalysisPrompt(inputs.standardCode, inputs.grade, fullStandardText, inputs.rawData);
        
        const analysisData = await fetchGeminiContent(prompt, analysisSchema, API_KEY);
        
        renderAnalysisReport(analysisData, inputs.standardCode, subjectSelect, gradeSelect);

    } catch (error) {
        console.error("Gemini API Error (Analysis):", error);
        DOMElements.errorMessageElement.textContent = `Error during analysis: ${error.message}. Check data format.`;
        DOMElements.errorMessageElement.classList.remove('hidden');
    } finally {
        DOMElements.loadingIndicator.classList.add('hidden');
        DOMElements.analyzeButton.disabled = false;
        DOMElements.analyzeButton.textContent = 'Analyze Data & Generate Report';
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file || !firebaseReady) {
        DOMElements.fileStatus.textContent = 'Initialization required. Please wait for "Session Active".';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            if (typeof jsonData !== 'object' || Array.isArray(jsonData)) {
                 throw new Error("Invalid JSON structure. Must be an object of subjects.");
            }
            saveStandardsToFirestore(jsonData);
        } catch (error) {
            DOMElements.fileStatus.textContent = `File Error: ${error.message}`;
            DOMElements.fileStatus.classList.replace('text-green-600', 'text-red-500');
        }
    };
    reader.readAsText(file);
}

async function saveStandardsToFirestore(jsonData) {
    if (!firebaseReady) return;
    const currentAppId = getAppId();

    try {
        const standardsRef = doc(db, `artifacts/${currentAppId}/users/${userId}/standards/current`);
        await setDoc(standardsRef, {
            data: JSON.stringify(jsonData),
            timestamp: new Date().toISOString()
        });
        console.log("Standards saved to Firestore.");
    } catch (e) {
        console.error("Error saving standards:", e);
        DOMElements.fileStatus.textContent = "Error saving file. Check console.";
    }
}


// Start the application lifecycle
initializeApp();
