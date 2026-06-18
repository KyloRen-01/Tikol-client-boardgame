import { useEffect } from "react";
import { saveGameSession, savePlayerProfile } from "./repository";
import { diag, diagError } from "../diagnostics/diagnosticLog";
import { usePlayerStore } from "../store/usePlayerStore";

export function useDatabaseLifecycle() {
  const player = usePlayerStore((state) => state.player);
  const currentSession = usePlayerStore((state) => state.currentSession);

  useEffect(() => {
    if (!player) {
      return;
    }

    diag("db.savePlayerProfile.begin", { id: player.id });
    savePlayerProfile(player).catch((error) => {
      diagError("db.savePlayerProfile.failed", error);
    });
  }, [player]);

  useEffect(() => {
    if (!player || !currentSession) {
      return;
    }

    diag("db.saveGameSession.begin", { id: currentSession.id });
    saveGameSession(currentSession, player.name).catch((error) => {
      diagError("db.saveGameSession.failed", error);
    });
  }, [currentSession, player]);
}
