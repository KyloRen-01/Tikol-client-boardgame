import type { PlayerProfile, QuestionBankItem, QuestionHistoryItem, SessionCard } from "../types/game";

const STORAGE_KEY = "tikol-web-db";

type WebDatabaseSnapshot = {
  players: PlayerProfile[];
  questions: QuestionBankItem[];
  sessions: SessionCard[];
  history: QuestionHistoryItem[];
};

const emptySnapshot: WebDatabaseSnapshot = {
  players: [],
  questions: [],
  sessions: [],
  history: [],
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
    return { ...emptySnapshot, ...(JSON.parse(raw) as Partial<WebDatabaseSnapshot>) };
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
  saveSession: (session: SessionCard) => {
    const snapshot = readSnapshot();
    const sessions = snapshot.sessions.filter((item) => item.id !== session.id);
    writeSnapshot({ ...snapshot, sessions: [session, ...sessions] });
  },
  saveHistory: (item: QuestionHistoryItem) => {
    const snapshot = readSnapshot();
    writeSnapshot({ ...snapshot, history: [...snapshot.history, item] });
  },
};

export const isPersistentDatabase = false;
