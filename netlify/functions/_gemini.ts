import 'cross-fetch/polyfill';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import type { Assignment, Item } from '../../src/types/assignment';

const DEFAULT_MODEL = 'gemini-2.5-flash';
const LEGACY_MODEL = 'gemini-1.5-flash';

const mcqSchema = z.object({
  type: z.literal('mcq'),
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).min(4),
  answerIndex: z.number().int().min(0)
});

const shortSchema = z.object({
  type: z.literal('short'),
  prompt: z.string().min(1),
  rubric: z.string().optional()
});

const itemSchema = z.union([mcqSchema, shortSchema]);

const assignmentSchema = z.object({
  title: z.string().min(1),
  standardCode: z.string().min(1),
  items: z.array(itemSchema).min(1)
});

export interface AssignmentPromptInput {
  title: string;
  standardCode: string;
  standardLabel: string;
  questionCount: number;
  type: 'mcq' | 'short' | 'mixed';
}

export interface AssignmentGenerationResult {
  assignment: Assignment;
  mockUsed: boolean;
  warnings: string[];
}

const buildPrompt = (input: AssignmentPromptInput) => {
  const { title, standardCode, standardLabel, questionCount, type } = input;
  const itemRule =
    type === 'mixed'
      ? 'Mix multiple choice and short response items. Include at least two of each when possible.'
      : type === 'mcq'
      ? 'All items must be multiple choice with four options and one correct answer.'
      : 'All items must be short response prompts with optional rubrics.';

  return `You are an instructional designer creating a Grade 7 civics assessment. Generate JSON only.
Assignment requirements:
- Align every item to the standard ${standardCode}: ${standardLabel}.
- Title must be "${title}".
- Include exactly ${questionCount} items.
- ${itemRule}

JSON schema (do not include comments):
{
  "title": string,
  "standardCode": string,
  "items": [
    {
      "type": "mcq" | "short",
      "stem"?: string,
      "prompt"?: string,
      "options"?: string[],
      "answerIndex"?: number,
      "rubric"?: string
    }
  ]
}
Rules:
- Multiple choice items require a "stem", four "options", and an "answerIndex" pointing to the correct option.
- Short response items require a "prompt" and may include a "rubric".
- Return compact JSON without additional commentary.`;
};

const mockItem = (index: number, input: AssignmentPromptInput): Item => {
  const basePrompt = `Explain how ${input.standardLabel.toLowerCase()} applies in a classroom scenario.`;
  if (input.type === 'short') {
    return {
      type: 'short',
      prompt: `${basePrompt} (Item ${index + 1})`,
      rubric: 'Response cites key principle and provides real-world connection.'
    };
  }

  if (input.type === 'mcq') {
    return {
      type: 'mcq',
      stem: `Which statement best reflects ${input.standardLabel.toLowerCase()}? (Item ${index + 1})`,
      options: ['Civic duty', 'Federalism', 'Separation of powers', 'Rule of law'],
      answerIndex: 2
    };
  }

  return index % 2 === 0
    ? {
        type: 'mcq',
        stem: `What does ${input.standardLabel.toLowerCase()} emphasize? (Item ${index + 1})`,
        options: ['Civic virtue', 'Checks and balances', 'Judicial review', 'Direct democracy'],
        answerIndex: 1
      }
    : {
        type: 'short',
        prompt: `${basePrompt} (Item ${index + 1})`,
        rubric: 'Highlights civic responsibility with supporting detail.'
      };
};

const buildMockAssignment = (input: AssignmentPromptInput): Assignment => {
  const now = Date.now();
  return {
    title: input.title,
    standardCode: input.standardCode,
    createdAt: now,
    items: Array.from({ length: input.questionCount }).map((_, index) => mockItem(index, input))
  };
};

const parseAssignment = (payload: unknown, input: AssignmentPromptInput): Assignment => {
  const parsed = assignmentSchema.parse(payload);
  const normalizedItems: Item[] = parsed.items.map((item) => {
    if (item.type === 'mcq') {
      const options = item.options.slice(0, 4);
      const answerIndex = Math.min(Math.max(item.answerIndex ?? 0, 0), options.length - 1);
      return { type: 'mcq', stem: item.stem, options, answerIndex };
    }
    return { type: 'short', prompt: item.prompt, rubric: item.rubric };
  });

  return {
    title: parsed.title || input.title,
    standardCode: parsed.standardCode || input.standardCode,
    createdAt: Date.now(),
    items: normalizedItems
  };
};

export const generateAssignmentJson = async (input: AssignmentPromptInput): Promise<AssignmentGenerationResult> => {
  const apiKey = process.env.GEMINI_API_KEY;
  const warnings: string[] = [];

  if (!apiKey) {
    warnings.push('Missing environment variable: GEMINI_API_KEY. Using mock output.');
    return { assignment: buildMockAssignment(input), mockUsed: true, warnings };
  }

  const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const prompt = buildPrompt(input);

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    });

    const text = response.response?.text?.() ?? response.response?.text() ?? '';
    const cleaned = text.trim();
    if (!cleaned) {
      warnings.push('Gemini returned an empty response; using mock assignment.');
      return { assignment: buildMockAssignment(input), mockUsed: true, warnings };
    }

    try {
      const parsedJson = JSON.parse(cleaned);
      const assignment = parseAssignment(parsedJson, input);
      return { assignment, mockUsed: false, warnings };
    } catch (parseError) {
      warnings.push(parseError instanceof Error ? parseError.message : 'Unable to parse Gemini response.');
      return { assignment: buildMockAssignment(input), mockUsed: true, warnings };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gemini request failed.';
    warnings.push(message);

    if (modelName !== LEGACY_MODEL) {
      warnings.push(`Falling back to ${LEGACY_MODEL}.`);
      try {
        const legacyModel = genAI.getGenerativeModel({ model: LEGACY_MODEL });
        const legacyResponse = await legacyModel.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json'
          }
        });
        const legacyText = legacyResponse.response?.text?.() ?? legacyResponse.response?.text() ?? '';
        if (legacyText.trim()) {
          try {
            const parsedJson = JSON.parse(legacyText);
            const assignment = parseAssignment(parsedJson, input);
            return { assignment, mockUsed: false, warnings };
          } catch (legacyError) {
            warnings.push(legacyError instanceof Error ? legacyError.message : 'Unable to parse legacy model response.');
          }
        } else {
          warnings.push('Legacy model returned empty response.');
        }
      } catch (legacyFailure) {
        warnings.push(legacyFailure instanceof Error ? legacyFailure.message : 'Legacy model request failed.');
      }
    }

    warnings.push('Using mock assignment due to Gemini issues.');
    return { assignment: buildMockAssignment(input), mockUsed: true, warnings };
  }
};
