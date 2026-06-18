import { useEffect, useState } from "react";
import { initializeDatabase, seedQuestionBank } from "../db/repository";
import { INITIAL_QUESTIONS } from "../db/seed";
import { useGameStore } from "../store/gameStore";
import { diag, diagError, normalizeError } from "./diagnosticLog";

type StartupState = { ready: boolean; error: string | null };

export function useStartupDiagnostics() {
  const hydrateSession = useGameStore((state) => state.hydrateSession);
  const [state, setState] = useState<StartupState>({ ready: false, error: null });

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        diag("startup.begin");
        diag("startup.db.initialize.begin");
        await initializeDatabase();
        diag("startup.db.initialize.ok");

        diag("startup.db.seed.begin", { count: INITIAL_QUESTIONS.length });
        await seedQuestionBank(INITIAL_QUESTIONS);
        diag("startup.db.seed.ok");

        diag("startup.zustand.hydrateSession.begin");
        const token = await hydrateSession();
        diag("startup.zustand.hydrateSession.ok", { hasToken: !!token });

        if (active) setState({ ready: true, error: null });
        diag("startup.ready");
      } catch (error) {
        diagError("startup.failed", error);
        if (active) setState({ ready: false, error: JSON.stringify(normalizeError(error), null, 2) });
      }
    }

    void run();
    return () => {
      active = false;
    };
  }, [hydrateSession]);

  return state;
}
