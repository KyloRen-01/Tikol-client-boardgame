import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { listGameSessions } from "../db/repository";
import { useNavigationStore } from "../store/useNavigationStore";
import type { SessionCard } from "../types/game";

export function HistoryBoardsScreen() {
  const [sessions, setSessions] = useState<SessionCard[]>([]);
  const openSessionDetail = useNavigationStore((state) => state.openSessionDetail);
  const load = useCallback(() => {
    listGameSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  useEffect(load, [load]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>History Boards</Text>
      {sessions.map((session) => (
        <Pressable key={session.id} onPress={() => openSessionDetail(session.id)} style={styles.card}>
          <Text style={styles.name}>{session.playerName}</Text>
          <Text style={styles.meta}>{new Date(session.startedAt).toLocaleString()}</Text>
          <Text style={styles.meta}>Character: {session.characterId}</Text>
        </Pressable>
      ))}
      {sessions.length === 0 ? <Text style={styles.empty}>No sessions yet.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, padding: 20, paddingTop: 84 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 8 },
  card: { backgroundColor: "#17213b", borderRadius: 8, padding: 16 },
  name: { color: "#ffb12d", fontSize: 18, fontWeight: "900" },
  meta: { color: "#d8e2ff", fontSize: 14, fontWeight: "700", marginTop: 4 },
  empty: { color: "#d8e2ff", fontSize: 16, fontWeight: "700" },
});
