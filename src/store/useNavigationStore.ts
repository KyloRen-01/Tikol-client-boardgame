import { create } from "zustand";
import type { NavigationScreen } from "../types/game";

const FLOW: NavigationScreen[] = [
  "HOME",
  "NAME_INPUT",
  "CHARACTER_SELECTION",
  "GAME_BOARD",
];

interface NavigationState {
  currentScreen: NavigationScreen;
  history: NavigationScreen[];
  goTo: (screen: NavigationScreen) => void;
  goNext: () => void;
  goBack: () => void;
  reset: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentScreen: "HOME",
  history: [],
  goTo: (screen) =>
    set((state) => ({
      currentScreen: screen,
      history:
        state.currentScreen === screen
          ? state.history
          : [...state.history, state.currentScreen],
    })),
  goNext: () => {
    const currentIndex = FLOW.indexOf(get().currentScreen);
    const nextScreen = FLOW[Math.min(currentIndex + 1, FLOW.length - 1)];
    get().goTo(nextScreen);
  },
  goBack: () =>
    set((state) => {
      const previousScreen = state.history[state.history.length - 1] ?? "HOME";

      return {
        currentScreen: previousScreen,
        history: state.history.slice(0, -1),
      };
    }),
  reset: () => set({ currentScreen: "HOME", history: [] }),
}));
