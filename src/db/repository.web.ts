import { webDb } from "./client.web";
import type { GameSession, PlayerProfile, QuestionBankItem, QuestionHistoryItem } from "../types/game";

export async function initializeDatabase() {
  return Promise.resolve();
}

export async function savePlayerProfile(player: PlayerProfile) {
  webDb.savePlayer(player);
}

export async function getPlayerProfile(id: string) {
  return webDb.getSnapshot().players.find((player) => player.id === id) ?? null;
}

export async function seedQuestionBank(questions: QuestionBankItem[]) {
  webDb.seedQuestions(questions);
}

export async function listQuestions() {
  return webDb.listQuestions();
}

export async function saveGameSession(session: GameSession, playerName: string) {
  webDb.saveSession({
    id: session.id,
    playerName,
    characterId: session.characterId,
    startedAt: session.startedAt,
  });
}

export async function saveQuestionHistory(item: Omit<QuestionHistoryItem, "id">) {
  webDb.saveHistory({ ...item, id: Date.now() });
}

export async function listGameSessions() {
  return webDb.getSnapshot().sessions.sort((a, b) => b.startedAt - a.startedAt);
}

export async function listQuestionHistory(sessionId: string) {
  return webDb
    .getSnapshot()
    .history.filter((item) => item.sessionId === sessionId)
    .sort((a, b) => a.answeredAt - b.answeredAt);
}
