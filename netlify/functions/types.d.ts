export interface AssessmentBlueprint {
  standardCode: string;
  standardName: string;
  subject: string;
  grade: string;
  assessmentType: "MultipleChoice" | "ShortAnswer" | "Mixed";
  questionCount: number;
  aiInsights: {
    overview: string;
    classStrategies: string[];
    nextSteps: string[];
    pedagogy: {
      summary: string;
      bestPractices: string[];
      reflectionPrompts: string[];
    }
  };
  levels: Array<{
    level: "Emerging" | "Developing" | "Proficient" | "Advanced";
    description: string;
    questions: Array<{
      id: string;
      prompt: string;
      options?: string[];
      answer: string;
      rationale: string;
    }>;
  }>;
}
