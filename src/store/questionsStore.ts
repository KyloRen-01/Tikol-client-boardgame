export type Question = {
  id: number;
  text: string;
  choices: [string, string, string, string];
  correctAnswerIndex: number;
  correctAnswerPoints: number;
  incorrectAnswerPoints: number;
};

export const QUESTIONS_BY_TILE_INDEX: Record<number, Question> = {
  4: {
    id: 1,
    text: "Which particle state has a fixed shape and fixed volume?",
    choices: ["Solid", "Liquid", "Gas", "Plasma"],
    correctAnswerIndex: 0,
    correctAnswerPoints: 2,
    incorrectAnswerPoints: -1,
  },
  11: {
    id: 2,
    text: "What happens to particles when matter is heated?",
    choices: [
      "They move slower",
      "They move faster",
      "They disappear",
      "They stop moving",
    ],
    correctAnswerIndex: 1,
    correctAnswerPoints: 2,
    incorrectAnswerPoints: -1,
  },
  26: {
    id: 3,
    text: "Which particle state takes the shape of its container but keeps its volume?",
    choices: ["Solid", "Liquid", "Gas", "None of these"],
    correctAnswerIndex: 1,
    correctAnswerPoints: 2,
    incorrectAnswerPoints: -1,
  },
  52: {
    id: 4,
    text: "Which particle state spreads out to fill all available space?",
    choices: ["Solid", "Liquid", "Gas", "Ice"],
    correctAnswerIndex: 2,
    correctAnswerPoints: 2,
    incorrectAnswerPoints: -1,
  },
  53: {
    id: 4,
    text: "Which particle state spreads out to fill all available space?",
    choices: ["Solid", "Liquid", "Gas", "Ice"],
    correctAnswerIndex: 2,
    correctAnswerPoints: 2,
    incorrectAnswerPoints: -1,
  },
};
