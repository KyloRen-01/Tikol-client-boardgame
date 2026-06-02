import { create } from "zustand";

export type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;
export type MatterPhase = "SOLID" | "LIQUID" | "GAS";

const START_TILE_INDEX = 0;
const FINISH_TILE_INDEX = 50;

function clampTileIndex(tileIndex: number) {
  return Math.max(START_TILE_INDEX, Math.min(FINISH_TILE_INDEX, tileIndex));
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
  diceResult: DiceFace;
  currentTileIndex: number;
  currentPhase: MatterPhase;
  setDiceResult: (diceResult: DiceFace) => void;
  setCurrentTileIndex: (tileIndex: number) => void;
  movePlayer: (steps: number) => void;
  resetBoardPosition: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  diceResult: 1,
  currentTileIndex: START_TILE_INDEX,
  currentPhase: getPhaseForTile(START_TILE_INDEX),
  setDiceResult: (diceResult) => set({ diceResult }),
  setCurrentTileIndex: (tileIndex) => {
    const nextTileIndex = clampTileIndex(tileIndex);

    set({
      currentTileIndex: nextTileIndex,
      currentPhase: getPhaseForTile(nextTileIndex),
    });
  },
  movePlayer: (steps) =>
    set((state) => {
      const nextTileIndex = clampTileIndex(state.currentTileIndex + steps);

      return {
        currentTileIndex: nextTileIndex,
        currentPhase: getPhaseForTile(nextTileIndex),
      };
    }),
  resetBoardPosition: () =>
    set({
      diceResult: 1,
      currentTileIndex: START_TILE_INDEX,
      currentPhase: getPhaseForTile(START_TILE_INDEX),
    }),
}));
