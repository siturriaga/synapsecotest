export type MCQ = {
  type: 'mcq';
  stem: string;
  options: string[];
  answerIndex: number;
};

export type Short = {
  type: 'short';
  prompt: string;
  rubric?: string;
};

export type Item = MCQ | Short;

export interface Assignment {
  id?: string;
  title: string;
  standardCode: string;
  items: Item[];
  createdAt: number;
}
