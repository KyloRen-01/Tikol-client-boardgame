import { create } from "zustand";

type ScoreState = {
  score: number;
  incrementScore: (points: number) => void;
  resetScore: () => void;
};

export const useScoreStore = create<ScoreState>((set) => ({
  score: 0,
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  resetScore: () => set({ score: 0 }),
}));
