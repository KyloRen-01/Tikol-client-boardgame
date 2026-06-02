import { create } from "zustand";
import type { CharacterId, GameSession, PlayerProfile } from "../types/game";

interface PlayerState {
  player: PlayerProfile | null;
  currentSession: GameSession | null;
  pendingCharacter: CharacterId | null;
  setPlayerName: (name: string) => void;
  selectCharacter: (characterId: CharacterId) => void;
  requestCharacterConfirmation: (characterId: CharacterId) => void;
  cancelCharacterConfirmation: () => void;
  confirmCharacter: () => CharacterId | null;
  startSession: () => GameSession | null;
  setCurrentTile: (tileId: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  currentSession: null,
  pendingCharacter: null,
  setPlayerName: (name) =>
    set((state) => ({
      player: {
        id: state.player?.id ?? `player-${Date.now()}`,
        name: name.trim(),
        selectedCharacter: state.player?.selectedCharacter ?? null,
        confirmedCharacter: state.player?.confirmedCharacter ?? null,
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
            confirmedCharacter: null,
            createdAt: Date.now(),
          },
    })),
  requestCharacterConfirmation: (characterId) =>
    set((state) => ({
      pendingCharacter: characterId,
      player: state.player
        ? { ...state.player, selectedCharacter: characterId }
        : {
            id: `player-${Date.now()}`,
            name: "Player",
            selectedCharacter: characterId,
            confirmedCharacter: null,
            createdAt: Date.now(),
          },
    })),
  cancelCharacterConfirmation: () => set({ pendingCharacter: null }),
  confirmCharacter: () => {
    const { pendingCharacter, player } = get();

    if (!pendingCharacter) {
      return null;
    }

    set({
      pendingCharacter: null,
      player: player
        ? {
            ...player,
            selectedCharacter: pendingCharacter,
            confirmedCharacter: pendingCharacter,
          }
        : {
            id: `player-${Date.now()}`,
            name: "Player",
            selectedCharacter: pendingCharacter,
            confirmedCharacter: pendingCharacter,
            createdAt: Date.now(),
          },
    });

    return pendingCharacter;
  },
  startSession: () => {
    const { player } = get();

    const characterId = player?.confirmedCharacter ?? player?.selectedCharacter;

    if (!player || !characterId) {
      return null;
    }

    const session: GameSession = {
      id: `session-${Date.now()}`,
      playerId: player.id,
      characterId,
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
