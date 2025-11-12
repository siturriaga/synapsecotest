import { API_KEY, API_URL, firebaseConfig, getToken } from './config.js';
import { fetchWithRetries } from './app.js'; // Import utility function

// --- JSON Schemas (Content Generation) ---
const quizSchema = (count) => ({ type: "OBJECT", properties: { quizTitle: { type: "STRING" }, level: { type: "STRING" }, questions: { type: "ARRAY", description: `Array of exactly ${count} multiple-choice questions.`, items: { type: "OBJECT", properties: { questionText: { type: "STRING" }, options: { type: "OBJECT", properties: { A: { type: "STRING" }, B: { type: "STRING" }, C: { type: "STRING" }, D: { type: "STRING" } }, required: ["A", "B", "C", "D"] }, correctAnswer: { type: "STRING" } }, required: ["questionText", "options", "correctAnswer"] } } }, required: ["quizTitle", "level", "questions"] });
const conceptMapSchema = (count) => ({ type: "OBJECT", properties: { title: { type: "STRING" }, level: { type: "STRING" }, concepts: { type: "ARRAY", description: `Array of exactly ${count} core concepts and their differentiated definitions.`, items: { type: "OBJECT", properties: { concept: { type: "STRING" }, definition: { type: "STRING" }, }, required: ["concept", "definition"] } } }, required: ["title", "level", "concepts"] });
const tdqSchema = (count) => ({ type: "OBJECT", properties: { assignmentTitle: { type: "STRING" }, level: { type: "STRING" }, story: { type: "STRING", description: "The full story/informational text generated for the TDQs." }, questions: { type: "ARRAY", description: `Array of exactly ${count} Text-Dependent Questions (TDQs).`, items: { type: "OBJECT", properties: { question: { type: "STRING" }, complexity: { type: "STRING", description: "DOK Level (1, 2, 3, or 4)." }, }, required: ["question", "complexity"] } } }, required: ["assignmentTitle", "level", "story", "questions"] });
const mixedSchema = (count) => ({ type: "OBJECT", properties: { assignmentTitle: { type: "STRING" }, level: { type: "STRING" }, mcqs: { type: "ARRAY", description: `Array of exactly ${Math.floor(count / 2)} Multiple Choice Questions.`, items: { type: "OBJECT", properties: { questionText: { type: "STRING" }, options: { type: "OBJECT", properties: { A: { type: "STRING" }, B: { type: "STRING" }, C: { type: "STRING" }, D: { type: "STRING" } }, required: ["A", "B", "C", "D"] }, correctAnswer: { type: "STRING" } }, required: ["questionText", "options", "correctAnswer"] } }, longerQuestions: { type: "ARRAY", description: `Array of exactly ${Math.ceil(count / 2)} short answer/open-ended questions.`, items: { type: "OBJECT", properties: { prompt: { type: "STRING" }, requiredLength: { type: "STRING", description: "e.g., 2-3 sentences or 1 paragraph." } }, required: ["prompt", "requiredLength"] } } }, required: ["assignmentTitle", "level", "mcqs", "longerQuestions"] });

// JSON Schema for Data Analysis (Mastery Bands and Insights)
const analysisSchema = {
    type: "OBJECT",
    properties: {
        masteryBand: {
            type: "OBJECT",
            description: "Overall class performance band.",
            properties: {
                band: { type: "STRING", enum: ["High Mastery", "Proficient", "Developing", "Needs Remediation"] },
                score: { type: "STRING", description: "Approximate class average score (e.g., 78%)." },
                summary: { type: "STRING", description: "One sentence summary of the status." }
            },
            required: ["band", "score", "summary"]
        },
        generalInsights: {
            type: "STRING",
            description: "General, high-level pedagogical findings for the class (1-2 paragraphs)."
        },
        classFindings: {
            type: "STRING",
            description: "Specific common errors, fuzzy concepts, or variations in student answers (1-2 paragraphs). Inject N/A if specific data is missing."
        },
        pedagogicalRecommendations: {
            type: "STRING",
            description: "Actionable, multi-step teaching strategies for remediation, customized to the found deficits (1-2 paragraphs)."
        },
        individualFlags: {
            type: "STRING",
            description: "Identifies 1-2 specific students (by name/ID if available) who need immediate intervention, based on lowest scores or unique error patterns. Inject N/A if specific student data is missing."
        }
    },
    required: ["masteryBand", "generalInsights", "classFindings", "pedagogicalRecommendations", "individualFlags"]
};


// --- PROMPT BUILDERS ---

export const getStoryPrompt = (standardCode, level, gradeLevel, fullStandardText) => { 
    let storyRules = "Generate a story (2-3 paragraphs) that explains the core concept of the standard.";
    let storyStyle = `You must write for a **${gradeLevel}** student. Use a nagging, yet supportive, tutor persona to transmit the information. Be culturally responsible.`;

    if (level === 'ELL') {
        storyRules = "Generate a story that explains the core concept of the standard. The narrative must be exactly 2-3 **very short, simple sentences** per paragraph, using the simplest vocabulary possible. Immediately after the story, provide a single sentence describing a simple picture or visual aid that the teacher should use to teach this concept (e.g., 'Visual Aid Suggestion: Picture of two kids sharing a cookie.').";
        storyStyle = `Use a supportive, encouraging tone. Use minimal to no complex English suitable for a **${gradeLevel}** ELL student. Bold key vocabulary words.`;
    }

    return {
        system: `You are a pedagogical expert and tutor. Follow these instructions precisely. The content must be 100% aligned to this standard's text: [${fullStandardText}]. You may use creative scenarios and examples if they benefit student academic understanding. ${storyStyle}`,
        user: `Based on the FL Standard ${standardCode}: ${storyRules}`
    };
};

export const getAssignmentInstructions = (standardCode, format, level, count, gradeLevel, fullStandardText) => { 
    let assignmentType = "";
    let difficulty = "";
    const gradeInstruction = `The content must be appropriate for a **${gradeLevel}** student.`;

    switch (level) {
        case 'Advanced': difficulty = "Generate questions/items at Depth of Knowledge (DOK) level 3 or 4, requiring synthesis, analysis, and evaluation. Use complex, academic vocabulary."; break;
        case 'Developing': difficulty = "Generate questions/items at Depth of Knowledge (DOK) level 1 or 2, focusing on recall, application, and basic understanding. Provide generous contextual clues."; break;
        case 'ELL': difficulty = "Generate questions/items using the absolute simplest grammar and vocabulary. Questions must be brief, short, and highly chunked. The focus is on basic identification."; break;
        case 'On-Level': default: difficulty = `Generate questions/items appropriate for a typical ${gradeLevel} student, balanced across DOK levels 2 and 3.`; break;
    }

    switch (format) {
        case 'MCQ': assignmentType = `Generate a Multiple Choice Quiz with exactly ${count} questions. Each question must have four options (A, B, C, D) and a single correct answer.`; break;
        case 'ConceptMap': assignmentType = `Generate a list of exactly ${count} core concepts related to the standard. For each concept, provide a concise, differentiated definition (the 'Map' structure). No quiz questions.`; break;
        case 'TDQs': assignmentType = `Generate exactly ${count} Text-Dependent Questions (TDQs) based on the story/text. The TDQs MUST mirror the style of the FL FAST Reading Test, including multi-part questions or questions requiring evidence.`; break;
        case 'Mixed':
            const halfCount = Math.floor(count / 2);
            assignmentType = `Generate a Mixed Assignment. It must contain ${halfCount} Multiple Choice Questions (A-D, single correct answer) AND ${Math.ceil(count / 2)} longer Short Answer/Open-Ended Questions.`;
            break;
    }

    return {
        system: `You are a pedagogical expert specializing in Florida B.E.S.T. Standards. ${gradeInstruction} The content must be 100% aligned to this standard's text: [${fullStandardText}]. You may use creative scenarios and examples if they benefit student academic understanding. Generate ${format} content based on the standard ${standardCode}. You MUST follow the JSON schema. Be culturally responsible. Differentiation: ${difficulty}`,
        user: `FL Standard: ${standardCode}. Task: ${assignmentType}`
    };
};

export const getAnalysisPrompt = (standardCode, gradeLevel, fullStandardText, rawData) => {
    const system = `You are a Master Pedagogical Data Analyst and Curriculum Consultant. Your task is to analyze the provided raw student performance data against the standard. Your output MUST strictly follow the JSON schema. Be flexible: if raw student names/IDs or specific error patterns are not found, use 'N/A' in the corresponding fields. Your ultimate goal is to provide concise, actionable remediation steps for the teacher. The standard's context is: [${fullStandardText}].`;
    
    const user = `Analyze the following raw performance data for the standard ${standardCode} (Grade ${gradeLevel}):\n\nRaw Data:\n${rawData}\n\nProvide the required mastery band, findings, and pedagogical recommendations.`;

    return {
        system: system,
        user: user
    };
};


// --- API WRAPPER ---

export const fetchGeminiContent = async (prompt, schema, apiKey) => {
    const payload = {
        contents: [{ parts: [{ text: prompt.user }] }],
        systemInstruction: { parts: [{ text: prompt.system }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    };

    const response = await fetchWithRetries(API_URL + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonString) {
        throw new Error("Model failed to return structured JSON.");
    }
    return JSON.parse(jsonString);
};


// --- RENDERING FUNCTIONS ---

export const renderStory = (storyContent, level) => {
    const storyOutput = document.getElementById('story-content');
    let formattedText = storyContent;
    let title = "The Friendly Nag (Story & Context)";
    let visualAid = "";

    if (level === 'ELL') {
        const visualMatch = storyContent.match(/Visual Aid Suggestion:\s*(.*)/i);
        if (visualMatch && visualMatch[1]) {
            visualAid = `<p class="mt-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800">
                **Visual Aid Suggestion for Teacher:** ${visualMatch[1].trim()}
                <span class="block text-xs mt-1">(Use this simple picture to help explain the main idea with minimal language.)</span>
            </p>`;
            formattedText = storyContent.replace(visualMatch[0], '').trim();
        }
        title = "The Friendly Nag (Simple ELL Narrative)";
    }

    storyOutput.innerHTML = `
        <h3 class="text-xl font-semibold text-gray-800 mb-3">${title}</h3>
        <div class="p-4 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
            ${formattedText.split('\n\n').map(p => `<p class="mb-2">${p}</p>`).join('')}
            ${visualAid}
        </div>
    `;
};

export const renderAssignment = (data, format) => { 
    const assignmentContent = document.getElementById('assignment-content');
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

    // --- Content Type Rendering Logic ---
    if (format === 'MCQ' && data.questions) {
        html += `<div class="space-y-6">${renderQuestionList(data.questions, false)}</div>`;
    } else if (format === 'ConceptMap' && data.concepts) {
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
    } else if (format === 'TDQs' && data.story && data.questions) {
        html += `<div class="p-5 bg-gray-50 rounded-xl mb-6">
                    <h4 class="text-lg font-bold mb-2 text-gray-800">Source Text:</h4>
                    <div class="text-gray-700 whitespace-pre-wrap">${data.story}</div>
                </div>`;
        html += `<div class="space-y-6">${renderQuestionList(data.questions, false)}</div>`;
    } else if (format === 'Mixed' && data.mcqs && data.longerQuestions) {
        html += `<h4 class="text-xl font-bold mt-6 mb-4 text-gray-800">Multiple Choice Questions (Differentiated)</h4>`;
        html += renderQuestionList(data.mcqs, false);
        html += `<h4 class="text-xl font-bold mt-10 mb-4 text-gray-800">Short Answer/Extended Response (Differentiated)</h4>`;
        html += renderQuestionList(data.longerQuestions, true);
    } else {
        html = `<p class="text-red-500">Error: Could not render structured content.</p>`;
    }
    assignmentContent.innerHTML = html;
};

export const renderAnalysisReport = (data, standardCode, subjectSelect, gradeSelect) => {
    const masteryDashboard = document.getElementById('mastery-dashboard');
    const aiInsights = document.getElementById('ai-insights');
    const getCardClass = (band) => {
        if (band === 'High Mastery') return 'bg-green-100 text-green-800 border-green-500';
        if (band === 'Proficient') return 'bg-indigo-100 text-indigo-800 border-indigo-500';
        if (band === 'Developing') return 'bg-yellow-100 text-yellow-800 border-yellow-500';
        return 'bg-red-100 text-red-800 border-red-500';
    };

    const dashboardHtml = `
        <div class="p-4 rounded-xl border-l-4 ${getCardClass(data.masteryBand.band)}">
            <p class="text-sm font-medium">Overall Class Mastery Band</p>
            <p class="text-3xl font-bold">${data.masteryBand.band}</p>
            <p class="mt-1">${data.masteryBand.summary}</p>
            <p class="text-xs mt-2">Approximate Average Score: ${data.masteryBand.score}</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-100 border-l-4 border-gray-400 md:col-span-2">
            <p class="text-sm font-medium text-gray-700">Standard Analyzed</p>
            <p class="text-lg font-bold">${standardCode}</p>
            <p class="text-xs mt-1 text-gray-600">Grade ${gradeSelect.value} - Subject ${subjectSelect.value}</p>
        </div>
    `;

    masteryDashboard.innerHTML = dashboardHtml;

    aiInsights.innerHTML = `
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
};

// Expose schemas for use in app.js for API calls
export { quizSchema, conceptMapSchema, tdqSchema, mixedSchema, analysisSchema };
