import { create } from "zustand";
import {
  clearSessionToken,
  createSessionToken,
  getSessionToken,
} from "../utils/sessionToken";
import { useNavigationStore } from "./useNavigationStore";
import { usePlayerStore } from "./usePlayerStore";
import { Question, QUESTIONS_BY_TILE_INDEX } from "./questionsStore";
import {
  BonusChallenge,
  BONUS_CHALLENGES_BY_TILE_INDEX,
} from "./bonusChallengesStore";
import { saveQuestionHistory } from "../db/repository";
import { useScoreStore } from "./scoreStore";
export type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;
export type MatterPhase = "SOLID" | "LIQUID" | "GAS";

export const START_TILE_INDEX = 0;
export const FINISH_TILE_INDEX = 99;

export const QUESTION_TILE_INDEXES = Object.keys(QUESTIONS_BY_TILE_INDEX).map(
  Number,
);
export const BONUS_CHALLENGE_TILE_INDEXES = Object.keys(
  BONUS_CHALLENGES_BY_TILE_INDEX,
).map(Number);

function clampTileIndex(tileIndex: number) {
  return Math.max(START_TILE_INDEX, Math.min(FINISH_TILE_INDEX, tileIndex));
}

function getInitialGameState() {
  return {
    sessionToken: null,
    isSessionHydrated: false,
    diceResult: 1 as DiceFace,
    currentTileIndex: START_TILE_INDEX,
    currentPhase: getPhaseForTile(START_TILE_INDEX),
    activeQuestion: null as Question | null,
    activeBonusChallenge: null as BonusChallenge | null,
    isQuestionModalVisible: false,
    isBonusChallengeModalVisible: false,
    isPlayerMoving: false,
    isGameFinished: false,
    feedback: null as { correct: boolean; points: number } | null,
  };
}

export function getPhaseForTile(tileIndex: number): MatterPhase {
  const clampedTileIndex = clampTileIndex(tileIndex);

  if (clampedTileIndex <= 11) {
    return "SOLID";
  }

  if (clampedTileIndex <= 26) {
    return "LIQUID";
  }

  return "GAS";
}

type GameState = {
  sessionToken: string | null;
  isSessionHydrated: boolean;
  diceResult: DiceFace;
  currentTileIndex: number;
  currentPhase: MatterPhase;
  activeQuestion: Question | null;
  activeBonusChallenge: BonusChallenge | null;
  isQuestionModalVisible: boolean;
  isBonusChallengeModalVisible: boolean;
  isPlayerMoving: boolean;
  isGameFinished: boolean;
  feedback: { correct: boolean; points: number } | null;
  hydrateSession: () => Promise<string | null>;
  initializeSession: () => Promise<string>;
  endSession: () => Promise<void>;
  setDiceResult: (diceResult: DiceFace) => void;
  setCurrentTileIndex: (tileIndex: number) => void;
  movePlayer: (steps: number) => void;
  completePlayerMove: () => void;
  markGameFinished: () => void;
  checkTileForQuestion: (tileIndex: number) => void;
  closeQuestionModal: () => void;
  closeBonusChallengeModal: () => void;
  resolveQuestionAnswer: (selectedAnswerIndex: number) => void;
  resolveBonusChallengeAnswer: (selectedAnswerIndex: number) => void;
  closeFeedback: () => void;
  resetBoardPosition: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  ...getInitialGameState(),
  hydrateSession: async () => {
    const sessionToken = await getSessionToken();

    set({
      sessionToken,
      isSessionHydrated: true,
    });

    return sessionToken;
  },
  initializeSession: async () => {
    const sessionToken = await createSessionToken();
    useScoreStore.getState().resetScore();

    set({
      ...getInitialGameState(),
      isSessionHydrated: true,
      sessionToken,
    });

    return sessionToken;
  },
  endSession: async () => {
    await clearSessionToken();
    useScoreStore.getState().resetScore();
    usePlayerStore.getState().reset();
    useNavigationStore.getState().reset();

    set({
      ...getInitialGameState(),
      isSessionHydrated: true,
    });
  },
  setDiceResult: (diceResult) => set({ diceResult }),
  setCurrentTileIndex: (tileIndex) => {
    const nextTileIndex = clampTileIndex(tileIndex);
    const isMovingToNewTile = nextTileIndex !== get().currentTileIndex;

    set({
      currentTileIndex: nextTileIndex,
      currentPhase: getPhaseForTile(nextTileIndex),
      activeQuestion: null,
      activeBonusChallenge: null,
      isQuestionModalVisible: false,
      isBonusChallengeModalVisible: false,
      isPlayerMoving: isMovingToNewTile,
      isGameFinished:
        nextTileIndex < FINISH_TILE_INDEX ? false : get().isGameFinished,
    });
  },
  movePlayer: (steps) => {
    set((state) => {
      const nextTileIndex = clampTileIndex(state.currentTileIndex + steps);

      return {
        currentTileIndex: nextTileIndex,
        currentPhase: getPhaseForTile(nextTileIndex),
        activeQuestion: null,
        activeBonusChallenge: null,
        isQuestionModalVisible: false,
        isBonusChallengeModalVisible: false,
        isPlayerMoving: nextTileIndex !== state.currentTileIndex,
        isGameFinished:
          nextTileIndex < FINISH_TILE_INDEX ? false : state.isGameFinished,
      };
    });
  },
  completePlayerMove: () => {
    const state = get();

    if (state.currentTileIndex >= FINISH_TILE_INDEX) {
      set({
        activeQuestion: null,
        activeBonusChallenge: null,
        isQuestionModalVisible: false,
        isBonusChallengeModalVisible: false,
        isGameFinished: true,
        isPlayerMoving: false,
      });
      return;
    }

    set({ isPlayerMoving: false });
    get().checkTileForQuestion(state.currentTileIndex);
  },
  markGameFinished: () => {
    const state = get();

    if (state.currentTileIndex >= FINISH_TILE_INDEX && !state.isGameFinished) {
      set({ isGameFinished: true, isPlayerMoving: false });
    }
  },
  checkTileForQuestion: (tileIndex) => {
    const clampedTileIndex = clampTileIndex(tileIndex);
    const activeQuestion = QUESTIONS_BY_TILE_INDEX[clampedTileIndex] ?? null;
    const activeBonusChallenge =
      BONUS_CHALLENGES_BY_TILE_INDEX[clampedTileIndex] ?? null;

    set({
      activeQuestion,
      activeBonusChallenge,
      isQuestionModalVisible: activeQuestion !== null,
      isBonusChallengeModalVisible:
        activeQuestion === null && activeBonusChallenge !== null,
    });
  },
  closeQuestionModal: () =>
    set({
      activeQuestion: null,
      isQuestionModalVisible: false,
    }),
  closeBonusChallengeModal: () =>
    set({
      activeBonusChallenge: null,
      isBonusChallengeModalVisible: false,
    }),
  resolveQuestionAnswer: (selectedAnswerIndex) => {
    const activeQuestion = get().activeQuestion;

    if (!activeQuestion) {
      return;
    }

    const selectedAnswer = activeQuestion.choices[selectedAnswerIndex] ?? "";
    const correctAnswer = activeQuestion.choices[activeQuestion.correctAnswerIndex];
    const correct = selectedAnswerIndex === activeQuestion.correctAnswerIndex;
    const points = correct ? activeQuestion.correctAnswerPoints : 0;
    const sessionId = usePlayerStore.getState().currentSession?.id;

    if (correct) {
      useScoreStore.getState().incrementScore(activeQuestion.correctAnswerPoints);
    }

    if (sessionId) {
      void saveQuestionHistory({
        sessionId,
        questionId: activeQuestion.id,
        questionText: activeQuestion.text,
        selectedAnswer,
        correctAnswer,
        isCorrect: correct,
        points,
        answeredAt: Date.now(),
      });
    }

    set({
      activeQuestion: null,
      isQuestionModalVisible: false,
      feedback: { correct, points },
    });
  },
  resolveBonusChallengeAnswer: (selectedAnswerIndex) => {
    const activeBonusChallenge = get().activeBonusChallenge;

    if (!activeBonusChallenge) {
      return;
    }

    const selectedAnswer =
      activeBonusChallenge.choices[selectedAnswerIndex] ?? "";
    const correctAnswer =
      activeBonusChallenge.choices[activeBonusChallenge.correctAnswerIndex];
    const correct =
      selectedAnswerIndex === activeBonusChallenge.correctAnswerIndex;
    const points = correct ? activeBonusChallenge.correctAnswerPoints : 0;
    const sessionId = usePlayerStore.getState().currentSession?.id;

    if (correct) {
      useScoreStore
        .getState()
        .incrementScore(activeBonusChallenge.correctAnswerPoints);
    }

    if (sessionId) {
      void saveQuestionHistory({
        sessionId,
        questionId: activeBonusChallenge.id,
        questionText: `Bonus Challenge: ${activeBonusChallenge.title} - ${activeBonusChallenge.prompt}`,
        selectedAnswer,
        correctAnswer,
        isCorrect: correct,
        points,
        answeredAt: Date.now(),
      });
    }

    set({
      activeBonusChallenge: null,
      isBonusChallengeModalVisible: false,
      feedback: { correct, points },
    });
  },
  closeFeedback: () => set({ feedback: null }),
  resetBoardPosition: () =>
    set({
      diceResult: 1,
      currentTileIndex: START_TILE_INDEX,
      currentPhase: getPhaseForTile(START_TILE_INDEX),
      activeQuestion: null,
      activeBonusChallenge: null,
      isQuestionModalVisible: false,
      isBonusChallengeModalVisible: false,
      isPlayerMoving: false,
      isGameFinished: false,
      feedback: null,
    }),
}));
