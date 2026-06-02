import { create } from "zustand";

export type CharacterId = "Fire" | "Gas" | "Liquid" | "Solid";

export type GameSession = {
  id: string;
  characterId: CharacterId;
  tileId: number;
  startedAt: number;
};

interface GameState {
  selectedCharacter: CharacterId | null;
  currentSessionId: string | null;
  sessions: Record<string, GameSession>;
  selectCharacter: (id: CharacterId) => void;
  startGameSession: () => GameSession | null;
  setCurrentTile: (tileId: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  selectedCharacter: null,
  currentSessionId: null,
  sessions: {},
  selectCharacter: (id) => set({ selectedCharacter: id }),
  startGameSession: () => {
    let session: GameSession | null = null;

    set((state) => {
      if (!state.selectedCharacter) {
        return state;
      }

      session = {
        id: `session-${Date.now()}`,
        characterId: state.selectedCharacter,
        tileId: 1,
        startedAt: Date.now(),
      };

      return {
        currentSessionId: session.id,
        sessions: {
          ...state.sessions,
          [session.id]: session,
        },
      };
    });

    return session;
  },
  setCurrentTile: (tileId) =>
    set((state) => {
      if (!state.currentSessionId) {
        return state;
      }

      const currentSession = state.sessions[state.currentSessionId];
      if (!currentSession) {
        return state;
      }

      return {
        sessions: {
          ...state.sessions,
          [state.currentSessionId]: {
            ...currentSession,
            tileId,
          },
        },
      };
    }),
}));
