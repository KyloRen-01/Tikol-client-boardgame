import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CharacterId, QuestionBankItem } from "../types/game";

export const playerProfiles = sqliteTable("player_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  selectedCharacter: text("selected_character").$type<CharacterId>(),
  confirmedCharacter: text("confirmed_character").$type<CharacterId>(),
  createdAt: integer("created_at").notNull(),
});

export const questionBank = sqliteTable("question_bank", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prompt: text("prompt").notNull(),
  answer: text("answer").notNull(),
  matterState: text("matter_state").$type<CharacterId>().notNull(),
  difficulty: text("difficulty")
    .$type<QuestionBankItem["difficulty"]>()
    .notNull(),
});

export const gameSessions = sqliteTable("game_sessions", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull(),
  playerName: text("player_name").notNull(),
  characterId: text("character_id").$type<CharacterId>().notNull(),
  startedAt: integer("started_at").notNull(),
});

export const questionHistory = sqliteTable("question_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  questionId: integer("question_id").notNull(),
  questionText: text("question_text").notNull(),
  selectedAnswer: text("selected_answer").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  points: integer("points").notNull(),
  answeredAt: integer("answered_at").notNull(),
});

export const createTablesSql = `
CREATE TABLE IF NOT EXISTS player_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  selected_character TEXT,
  confirmed_character TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS question_bank (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  prompt TEXT NOT NULL,
  answer TEXT NOT NULL,
  matter_state TEXT NOT NULL,
  difficulty TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  character_id TEXT NOT NULL,
  started_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS question_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  session_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  points INTEGER NOT NULL,
  answered_at INTEGER NOT NULL
);
`;
