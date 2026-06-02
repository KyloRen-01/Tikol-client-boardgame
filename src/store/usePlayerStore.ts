import { create } from "zustand";
import type { CharacterId, GameSession, PlayerProfile } from "../types/game";

interface PlayerState {
  player: PlayerProfile | null;
  currentSession: GameSession | null;
  setPlayerName: (name: string) => void;
  selectCharacter: (characterId: CharacterId) => void;
  startSession: () => GameSession | null;
  setCurrentTile: (tileId: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  currentSession: null,
  setPlayerName: (name) =>
    set((state) => ({
      player: {
        id: state.player?.id ?? `player-${Date.now()}`,
        name: name.trim(),
        selectedCharacter: state.player?.selectedCharacter ?? null,
        createdAt: state.player?.createdAt ?? Date.now(),
      },
    })),
  selectCharacter: (characterId) =>
    set((state) => ({
      player: state.player
        ? { ...state.player, selectedCharacter: characterId }
        : {
            id: `player-${Date.now()}`,
            name: "Player",
            selectedCharacter: characterId,
            createdAt: Date.now(),
          },
    })),
  startSession: () => {
    const { player } = get();

    if (!player?.selectedCharacter) {
      return null;
    }

    const session: GameSession = {
      id: `session-${Date.now()}`,
      playerId: player.id,
      characterId: player.selectedCharacter,
      tileId: 1,
      startedAt: Date.now(),
    };

    set({ currentSession: session });
    return session;
  },
  setCurrentTile: (tileId) =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, tileId }
        : state.currentSession,
    })),
}));
