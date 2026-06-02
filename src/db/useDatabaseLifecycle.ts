import { useEffect } from "react";
import {
  initializeDatabase,
  savePlayerProfile,
  seedQuestionBank,
} from "./repository";
import { INITIAL_QUESTIONS } from "./seed";
import { usePlayerStore } from "../store/usePlayerStore";

export function useDatabaseLifecycle() {
  const player = usePlayerStore((state) => state.player);

  useEffect(() => {
    let isActive = true;

    async function prepareDatabase() {
      try {
        await initializeDatabase();
        await seedQuestionBank(INITIAL_QUESTIONS);
      } catch (error) {
        if (isActive) {
          console.warn("Database initialization failed", error);
        }
      }
    }

    prepareDatabase();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!player) {
      return;
    }

    savePlayerProfile(player).catch((error) => {
      console.warn("Player profile save failed", error);
    });
  }, [player]);
}
