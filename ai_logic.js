// --- JSON Schemas (Content Generation) ---

const quizSchema = (count) => ({ type: "OBJECT", properties: { quizTitle: { type: "STRING" }, level: { type: "STRING" }, questions: { type: "ARRAY", description: `Array of exactly ${count} multiple-choice questions.`, items: { type: "OBJECT", properties: { questionText: { type: "STRING" }, options: { type: "OBJECT", properties: { A: { type: "STRING" }, B: { type: "STRING" }, C: { type: "STRING" }, D: { type: "STRING" } }, required: ["A", "B", "C", "D"] }, correctAnswer: { type: "STRING" } }, required: ["questionText", "options", "correctAnswer"] } } }, required: ["quizTitle", "level", "questions"] });
const conceptMapSchema = (count) => ({ type: "OBJECT", properties: { title: { type: "STRING" }, level: { type: "STRING" }, concepts: { type: "ARRAY", description: `Array of exactly ${count} core concepts and their differentiated definitions.`, items: { type: "OBJECT", properties: { concept: { type: "STRING" }, definition: { type: "STRING" }, }, required: ["concept", "definition"] } } }, required: ["title", "level", "concepts"] });
const tdqSchema = (count) => ({ type: "OBJECT", properties: { assignmentTitle: { type: "STRING" }, level: { type: "STRING" }, story: { type: "STRING", description: "The full story/informational text generated for the TDQs." }, questions: { type: "ARRAY", description: `Array of exactly ${count} Text-Dependent Questions (TDQs).`, items: { type: "OBJECT", properties: { question: { type: "STRING" }, complexity: { type: "STRING", description: "DOK Level (1, 2, 3, or 4)." }, }, required: ["question", "complexity"] } } }, required: ["assignmentTitle", "level", "story", "questions"] });
const mixedSchema = (count) => ({ type: "OBJECT", properties: { assignmentTitle: { type: "STRING" }, level: { type: "STRING" }, mcqs: { type: "ARRAY", description: `Array of exactly ${Math.floor(count / 2)} Multiple Choice Questions.`, items: { type: "OBJECT", properties: { questionText: { type: "STRING" }, options: { type: "OBJECT", properties: { A: { type: "STRING" }, B: { type: "STRING" }, C: { type: "STRING" }, D: { type: "STRING" } }, required: ["A", "B", "C", "D"] }, correctAnswer: { type: "STRING" } }, required: ["questionText", "options", "correctAnswer"] } }, longerQuestions: { type: "ARRAY", description: `Array of exactly ${Math.ceil(count / 2)} short answer/open-ended questions.`, items: { type: "OBJECT", properties: { prompt: { type: "STRING" }, requiredLength: { type: "STRING", description: "e.g., 2-3 sentences or 1 paragraph." } }, required: ["prompt", "requiredLength"] } } }, required: ["assignmentTitle", "level", "mcqs", "longerQuestions"] });

// --- JSON Schema (Data Analysis) ---
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


// --- Prompt Generation Functions ---

export function getStoryPrompt(standardCode, level, gradeLevel, fullStandardText) { 
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
}

export function getAssignmentInstructions(standardCode, format, level, count, gradeLevel, fullStandardText) { 
    let assignmentType = "";
    let difficulty = "";
    const gradeInstruction = `The content must be appropriate for a **${gradeLevel}** student.`;

    switch (level) {
        case 'Advanced':
            difficulty = "Generate questions/items at Depth of Knowledge (DOK) level 3 or 4, requiring synthesis, analysis, and evaluation. Use complex, academic vocabulary.";
            break;
        case 'Developing':
            difficulty = "Generate questions/items at Depth of Knowledge (DOK) level 1 or 2, focusing on recall, application, and basic understanding. Provide generous contextual clues.";
            break;
        case 'ELL':
            difficulty = "Generate questions/items using the absolute simplest grammar and vocabulary. Questions must be brief, short, and highly chunked. The focus is on basic identification.";
            break;
        case 'On-Level':
        default:
            difficulty = `Generate questions/items appropriate for a typical ${gradeLevel} student, balanced across DOK levels 2 and 3.`;
    }

    switch (format) {
        case 'MCQ':
            assignmentType = `Generate a Multiple Choice Quiz with exactly ${count} questions. Each question must have four options (A, B, C, D) and a single correct answer.`;
            break;
        case 'ConceptMap':
            assignmentType = `Generate a list of exactly ${count} core concepts related to the standard. For each concept, provide a concise, differentiated definition (the 'Map' structure). No quiz questions.`;
            break;
        case 'TDQs':
            assignmentType = `Generate exactly ${count} Text-Dependent Questions (TDQs) based on the story/text. The TDQs MUST mirror the style of the FL FAST Reading Test, including multi-part questions or questions requiring evidence.`;
            break;
        case 'Mixed':
            const halfCount = Math.floor(count / 2);
            assignmentType = `Generate a Mixed Assignment. It must contain ${halfCount} Multiple Choice Questions (A-D, single correct answer) AND ${Math.ceil(count / 2)} longer Short Answer/Open-Ended Questions.`;
            break;
    }

    return {
        system: `You are a pedagogical expert specializing in Florida B.E.S.T. Standards. ${gradeInstruction} The content must be 100% aligned to this standard's text: [${fullStandardText}]. You may use creative scenarios and examples if they benefit student academic understanding. Generate ${format} content based on the standard ${standardCode}. You MUST follow the JSON schema. Be culturally responsible. Differentiation: ${difficulty}`,
        user: `FL Standard: ${standardCode}. Task: ${assignmentType}`
    };
}

export function getPayloadAndSchema(standardCode, format, level, count, gradeLevel, fullStandardText) { 
    const instructions = getAssignmentInstructions(standardCode, format, level, count, gradeLevel, fullStandardText);
    let schema;

    switch (format) {
        case 'MCQ': schema = quizSchema(count); break;
        case 'ConceptMap': schema = conceptMapSchema(count); break;
        case 'TDQs': schema = tdqSchema(count); break;
        case 'Mixed': schema = mixedSchema(count); break;
        default: throw new Error("Invalid format selected.");
    }

    return {
        payload: {
            contents: [{ parts: [{ text: instructions.user }] }],
            systemInstruction: { parts: [{ text: instructions.system }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        },
        schema: schema
    };
}

export function getAnalysisPrompt(standardCode, gradeLevel, fullStandardText, rawData) {
    const system = `You are a Master Pedagogical Data Analyst and Curriculum Consultant. Your task is to analyze the provided raw student performance data against the standard. Your output MUST strictly follow the JSON schema. Be flexible: if raw student names/IDs or specific error patterns are not found, use 'N/A' in the corresponding fields. Your ultimate goal is to provide concise, actionable remediation steps for the teacher. The standard's context is: [${fullStandardText}].`;
    
    const user = `Analyze the following raw performance data for the standard ${standardCode} (Grade ${gradeLevel}):\n\nRaw Data:\n${rawData}\n\nProvide the required mastery band, findings, and pedagogical recommendations.`;

    return {
        system: system,
        user: user,
        schema: analysisSchema
    };
}
