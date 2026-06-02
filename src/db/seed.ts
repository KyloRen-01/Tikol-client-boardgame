import type { QuestionBankItem } from "../types/game";

export const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 1,
    prompt: "Which state of matter keeps a fixed shape?",
    answer: "Solid",
    matterState: "Solid",
    difficulty: "easy",
  },
  {
    id: 2,
    prompt: "Which state of matter flows and takes the shape of its container?",
    answer: "Liquid",
    matterState: "Liquid",
    difficulty: "easy",
  },
  {
    id: 3,
    prompt: "Which state of matter spreads out to fill available space?",
    answer: "Gas",
    matterState: "Gas",
    difficulty: "easy",
  },
];
