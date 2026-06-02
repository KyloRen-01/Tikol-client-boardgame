import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CharacterId, QuestionBankItem } from "../types/game";

export const playerProfiles = sqliteTable("player_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  selectedCharacter: text("selected_character").$type<CharacterId>(),
  createdAt: integer("created_at").notNull(),
});

export const questionBank = sqliteTable("question_bank", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prompt: text("prompt").notNull(),
  answer: text("answer").notNull(),
  matterState: text("matter_state").$type<CharacterId>().notNull(),
  difficulty: text("difficulty").$type<QuestionBankItem["difficulty"]>().notNull(),
});

export const createTablesSql = `
CREATE TABLE IF NOT EXISTS player_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  selected_character TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS question_bank (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  prompt TEXT NOT NULL,
  answer TEXT NOT NULL,
  matter_state TEXT NOT NULL,
  difficulty TEXT NOT NULL
);
`;
