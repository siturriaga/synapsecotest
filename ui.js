// This file manages all direct DOM manipulation (rendering, state changes).
// It is imported by app.js and does not run on its own.

// --- DOM Element Cache ---
// This object will be populated by app.js
export const DOMElements = {};

export function cacheDOMElements() {
    const ids = [
        'app-container', 'subject-select', 'grade-select', 'standard-select', 
        'format-select', 'level-select', 'count-select', 'generate-button', 
        'analyze-button', 'output-card', 'loading-indicator', 'story-content', 
        'assignment-output', 'error-message', 'standards-file', 'file-status', 
        'login-container', 'login-button', 'login-status', 'user-welcome',
        'tab-content', 'tab-data', 'section-content', 'section-data', 
        'raw-data-input', 'analysis-output', 'mastery-dashboard', 'ai-insights',
        'sign-out-button'
    ];
    ids.forEach(id => {
        DOMElements[id] = document.getElementById(id);
    });
}

// --- UI State Changers ---

export function switchTab(target) {
    if (target === 'content') {
        DOMElements['section-content'].classList.remove('hidden');
        DOMElements['section-data'].classList.add('hidden');
        DOMElements['tab-content'].classList.replace('bg-gray-100', 'bg-indigo-600');
        DOMElements['tab-content'].classList.replace('text-gray-700', 'text-white');
        DOMElements['tab-data'].classList.replace('bg-indigo-600', 'bg-gray-100');
        DOMElements['tab-data'].classList.replace('text-white', 'text-gray-700');
    } else {
        DOMElements['section-content'].classList.add('hidden');
        DOMElements['section-data'].classList.remove('hidden');
        DOMElements['tab-data'].classList.replace('bg-gray-100', 'bg-indigo-600');
        DOMElements['tab-data'].classList.replace('text-gray-700', 'text-white');
        DOMElements['tab-content'].classList.replace('bg-indigo-600', 'bg-gray-100');
        DOMElements['tab-content'].classList.replace('text-white', 'text-gray-700');
    }
    DOMElements['output-card'].classList.add('hidden'); 
    DOMElements['error-message'].classList.add('hidden');
}

export function setLoadingState(isLoading, message = "Generating...") {
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

export function setErrorMessage(message) {
    DOMElements['error-message'].textContent = message;
    DOMElements['error-message'].classList.remove('hidden');
}

export function populateSubjectDropdown(standardsData) {
    const subjectSelect = DOMElements['subject-select'];
    const currentSubject = subjectSelect.value;
    subjectSelect.innerHTML = ''; 
    
    Object.keys(standardsData).forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
    
    if (standardsData[currentSubject]) {
        subjectSelect.value = currentSubject;
    }
}

export function populateStandardDropdown(standardsData, subject) {
    const standardSelect = DOMElements['standard-select'];
    standardSelect.innerHTML = '';
    standardSelect.disabled = true;

    const standardsList = standardsData[subject] || [];
    
    if (standardsList.length > 0) {
        standardsList.forEach(std => {
            const option = document.createElement('option');
            option.value = std.code;
            const desc = std.desc || std.name || 'No Description';
            option.textContent = `${std.code}: ${desc.substring(0, 40)}...`;
            standardSelect.appendChild(option);
        });
        standardSelect.disabled = false;
    } else {
        standardSelect.innerHTML = `<option value="" disabled selected>No standards for ${subject}</option>`;
    }
}

// --- Content Rendering Functions ---

export function renderStory(text, level) { 
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

export function renderAssignment(data, format) { 
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

    if (format === 'MCQ' && data.questions) {
        html += `<div class="space-y-6">${renderQuestionList(data.questions, false)}</div>`;
    }
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
    else if (format === 'TDQs' && data.story && data.questions) {
        html += `<div class="p-5 bg-gray-50 rounded-xl mb-6">
                    <h4 class="text-lg font-bold mb-2 text-gray-800">Source Text:</h4>
                    <div class="text-gray-700 whitespace-pre-wrap">${data.story}</div>
                </div>`;
        html += `<div class="space-y-6">${renderQuestionList(data.questions, false)}</div>`;
    }
    else if (format === 'Mixed' && data.mcqs && data.longerQuestions) {
        html += `<h4 class="text-xl font-bold mt-6 mb-4 text-gray-800">Multiple Choice Questions (Differentiated)</h4>`;
        html += renderQuestionList(data.mcqs, false);
        html += `<h4 class="text-xl font-bold mt-10 mb-4 text-gray-800">Short Answer/Extended Response (Differentiated)</h4>`;
        html += renderQuestionList(data.longerQuestions, true);
    }
    else {
        html = `<p class="text-red-500">Error: Could not render structured content.</p>`;
    }
    assignmentContent.innerHTML = html;
}

export function renderAnalysisReport(data, standardCode) {
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
            <!-- FIX: Corrected typo from masterYBand to masteryBand -->
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
