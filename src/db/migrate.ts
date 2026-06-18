import type { SQLiteDatabase } from "expo-sqlite";
import { diag } from "../diagnostics/diagnosticLog";
import { createTablesSql } from "./schema";

export async function runMigrations(rawDb: SQLiteDatabase) {
  diag("db.migration.execAsync.begin", { sqlLength: createTablesSql.length });
  await rawDb.execAsync(createTablesSql);
  diag("db.migration.execAsync.ok");
}
