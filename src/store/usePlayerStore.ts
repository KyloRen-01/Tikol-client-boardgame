import { create } from "zustand";
import { saveGameSession, savePlayerProfile } from "../db/repository";
import { diagError } from "../diagnostics/diagnosticLog";
import type { CharacterId, GameSession, PlayerProfile } from "../types/game";

function createSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface PlayerState {
  player: PlayerProfile | null;
  currentSession: GameSession | null;
  pendingCharacter: CharacterId | null;
  setPlayerName: (name: string) => void;
  selectCharacter: (characterId: CharacterId) => void;
  requestCharacterConfirmation: (characterId: CharacterId) => void;
  cancelCharacterConfirmation: () => void;
  confirmCharacter: () => CharacterId | null;
  startSession: () => Promise<GameSession | null>;
  setCurrentTile: (tileId: number) => void;
  reset: () => void;
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
  startSession: async () => {
    const { player } = get();

    const characterId = player?.confirmedCharacter ?? player?.selectedCharacter;

    if (!player || !characterId) {
      return null;
    }

    const session: GameSession = {
      id: createSessionId(),
      playerId: player.id,
      characterId,
      tileId: 1,
      startedAt: Date.now(),
    };
    const sessionPlayer: PlayerProfile = {
      ...player,
      selectedCharacter: characterId,
      confirmedCharacter: characterId,
    };

    set({ currentSession: session, player: sessionPlayer });

    try {
      await savePlayerProfile(sessionPlayer);
      await saveGameSession(session, sessionPlayer.name);
    } catch (error) {
      diagError("db.startSession.persist.failed", error);
    }

    return session;
  },
  setCurrentTile: (tileId) =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, tileId }
        : state.currentSession,
    })),
  reset: () =>
    set({
      player: null,
      currentSession: null,
      pendingCharacter: null,
    }),
}));
