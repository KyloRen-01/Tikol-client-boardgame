export type NavigationScreen =
  | "HOME"
  | "NAME_INPUT"
  | "CHARACTER_SELECTION"
  | "LOADING"
  | "GAME_BOARD"
  | "HISTORY_BOARDS"
  | "SESSION_DETAIL";

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
  confirmedCharacter: CharacterId | null;
  createdAt: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  characterId: CharacterId;
  tileId: number;
  startedAt: number;
}

export interface SessionCard {
  id: string;
  playerName: string;
  characterId: CharacterId;
  startedAt: number;
}

export interface QuestionHistoryItem {
  id: number;
  sessionId: string;
  questionId: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  answeredAt: number;
}

export interface QuestionBankItem {
  id: number;
  prompt: string;
  answer: string;
  matterState: CharacterId;
  difficulty: "easy" | "medium" | "hard";
}
