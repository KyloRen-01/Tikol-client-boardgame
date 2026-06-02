import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const sqlite = openDatabaseSync("tikol.db");

export const db = drizzle(sqlite, { schema });
export const rawDb = sqlite;
export const isPersistentDatabase = true;
