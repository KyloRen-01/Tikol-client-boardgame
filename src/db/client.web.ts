import type { PlayerProfile, QuestionBankItem } from "../types/game";

const STORAGE_KEY = "tikol-web-db";

type WebDatabaseSnapshot = {
  players: PlayerProfile[];
  questions: QuestionBankItem[];
};

const emptySnapshot: WebDatabaseSnapshot = {
  players: [],
  questions: [],
};

function readSnapshot(): WebDatabaseSnapshot {
  if (typeof localStorage === "undefined") {
    return emptySnapshot;
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return emptySnapshot;
  }

  try {
    return JSON.parse(raw) as WebDatabaseSnapshot;
  } catch {
    return emptySnapshot;
  }
}

function writeSnapshot(snapshot: WebDatabaseSnapshot) {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export const webDb = {
  getSnapshot: readSnapshot,
  savePlayer: (player: PlayerProfile) => {
    const snapshot = readSnapshot();
    const players = snapshot.players.filter((item) => item.id !== player.id);
    writeSnapshot({ ...snapshot, players: [...players, player] });
  },
  listQuestions: () => readSnapshot().questions,
  seedQuestions: (questions: QuestionBankItem[]) => {
    const snapshot = readSnapshot();
    writeSnapshot({ ...snapshot, questions });
  },
};

export const isPersistentDatabase = false;
