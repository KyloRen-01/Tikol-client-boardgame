export type NavigationScreen =
  | "HOME"
  | "NAME_INPUT"
  | "CHARACTER_SELECTION"
  | "GAME_BOARD";

export type CharacterId = "Solid" | "Liquid" | "Gas" | "Fire";

export interface CharacterOption {
  id: CharacterId;
  name: string;
  subtitle: string;
  color: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  selectedCharacter: CharacterId | null;
  createdAt: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  characterId: CharacterId;
  tileId: number;
  startedAt: number;
}

export interface QuestionBankItem {
  id: number;
  prompt: string;
  answer: string;
  matterState: CharacterId;
  difficulty: "easy" | "medium" | "hard";
}
