import { desc, eq } from "drizzle-orm";
import { db, rawDb } from "./client.native";
import { runMigrations } from "./migrate";
import { gameSessions, playerProfiles, questionBank, questionHistory } from "./schema";
import type { GameSession, PlayerProfile, QuestionBankItem, QuestionHistoryItem } from "../types/game";

export async function initializeDatabase() {
  await runMigrations(rawDb);
}

export async function savePlayerProfile(player: PlayerProfile) {
  await db
    .insert(playerProfiles)
    .values(player)
    .onConflictDoUpdate({
      target: playerProfiles.id,
      set: {
        name: player.name,
        selectedCharacter: player.selectedCharacter,
        confirmedCharacter: player.confirmedCharacter,
      },
    });
}

export async function getPlayerProfile(id: string) {
  const rows = await db.select().from(playerProfiles).where(eq(playerProfiles.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function seedQuestionBank(questions: QuestionBankItem[]) {
  await db.insert(questionBank).values(questions).onConflictDoNothing();
}

export async function listQuestions() {
  return db.select().from(questionBank);
}

export async function saveGameSession(session: GameSession, playerName: string) {
  await db.insert(gameSessions).values({
    id: session.id,
    playerId: session.playerId,
    playerName,
    characterId: session.characterId,
    startedAt: session.startedAt,
  }).onConflictDoNothing();
}

export async function saveQuestionHistory(item: Omit<QuestionHistoryItem, "id">) {
  await db.insert(questionHistory).values(item);
}

export async function listGameSessions() {
  return db.select().from(gameSessions).orderBy(desc(gameSessions.startedAt));
}

export async function listQuestionHistory(sessionId: string) {
  return db.select().from(questionHistory).where(eq(questionHistory.sessionId, sessionId)).orderBy(questionHistory.answeredAt);
}
