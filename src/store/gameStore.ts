import { create } from "zustand";
import {
  clearSessionToken,
  createSessionToken,
  getSessionToken,
} from "../utils/sessionToken";
import { useNavigationStore } from "./useNavigationStore";
import { usePlayerStore } from "./usePlayerStore";
import { Question, QUESTIONS_BY_TILE_INDEX } from "./questionsStore";
export type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;
export type MatterPhase = "SOLID" | "LIQUID" | "GAS";

const START_TILE_INDEX = 0;
const FINISH_TILE_INDEX = 99;

export const QUESTION_TILE_INDEXES = Object.keys(QUESTIONS_BY_TILE_INDEX).map(
  Number,
);

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
    isQuestionModalVisible: false,
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
  isQuestionModalVisible: boolean;
  hydrateSession: () => Promise<string | null>;
  initializeSession: () => Promise<string>;
  endSession: () => Promise<void>;
  setDiceResult: (diceResult: DiceFace) => void;
  setCurrentTileIndex: (tileIndex: number) => void;
  movePlayer: (steps: number) => void;
  checkTileForQuestion: (tileIndex: number) => void;
  closeQuestionModal: () => void;
  resolveQuestionAnswer: (selectedAnswerIndex: number) => void;
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

    set({
      ...getInitialGameState(),
      isSessionHydrated: true,
      sessionToken,
    });

    return sessionToken;
  },
  endSession: async () => {
    await clearSessionToken();
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

    set({
      currentTileIndex: nextTileIndex,
      currentPhase: getPhaseForTile(nextTileIndex),
    });
    get().checkTileForQuestion(nextTileIndex);
  },
  movePlayer: (steps) => {
    let landedTileIndex = START_TILE_INDEX;

    set((state) => {
      const nextTileIndex = clampTileIndex(state.currentTileIndex + steps);
      landedTileIndex = nextTileIndex;

      return {
        currentTileIndex: nextTileIndex,
        currentPhase: getPhaseForTile(nextTileIndex),
      };
    });
    get().checkTileForQuestion(landedTileIndex);
  },
  checkTileForQuestion: (tileIndex) => {
    const activeQuestion =
      QUESTIONS_BY_TILE_INDEX[clampTileIndex(tileIndex)] ?? null;

    set({
      activeQuestion,
      isQuestionModalVisible: activeQuestion !== null,
    });
  },
  closeQuestionModal: () =>
    set({
      activeQuestion: null,
      isQuestionModalVisible: false,
    }),
  resolveQuestionAnswer: (selectedAnswerIndex) => {
    const activeQuestion = get().activeQuestion;

    if (!activeQuestion) {
      return;
    }

    set({
      activeQuestion: null,
      isQuestionModalVisible: false,
    });
  },
  resetBoardPosition: () =>
    set({
      diceResult: 1,
      currentTileIndex: START_TILE_INDEX,
      currentPhase: getPhaseForTile(START_TILE_INDEX),
      activeQuestion: null,
      isQuestionModalVisible: false,
    }),
}));
