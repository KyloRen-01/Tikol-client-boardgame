import { webDb } from "./client.web";
import type { PlayerProfile, QuestionBankItem } from "../types/game";

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
