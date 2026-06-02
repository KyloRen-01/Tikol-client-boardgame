import { eq } from "drizzle-orm";
import { db, rawDb } from "./client.native";
import { createTablesSql, playerProfiles, questionBank } from "./schema";
import type { PlayerProfile, QuestionBankItem } from "../types/game";

export async function initializeDatabase() {
  await rawDb.execAsync(createTablesSql);
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
