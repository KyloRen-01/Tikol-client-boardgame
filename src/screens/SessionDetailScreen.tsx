import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { listQuestionHistory } from "../db/repository";
import { useNavigationStore } from "../store/useNavigationStore";
import type { QuestionHistoryItem } from "../types/game";
import { exportSessionForSheets } from "../utils/sessionExport";

export function SessionDetailScreen() {
  const sessionId = useNavigationStore((state) => state.selectedSessionId);
  const [items, setItems] = useState<QuestionHistoryItem[]>([]);
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "done" | "error">("idle");
  const load = useCallback(() => {
    if (!sessionId) return;
    listQuestionHistory(sessionId).then(setItems).catch(() => setItems([]));
  }, [sessionId]);
  const canExport = items.length > 0 && exportStatus !== "exporting";
  const handleExport = useCallback(async () => {
    if (!sessionId || items.length === 0) {
      return;
    }

    setExportStatus("exporting");

    try {
      await exportSessionForSheets(sessionId, items);
      setExportStatus("done");
    } catch {
      setExportStatus("error");
    }
  }, [items, sessionId]);

  useEffect(load, [load]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Questions</Text>
        <Pressable
          accessibilityRole="button"
          disabled={!canExport}
          onPress={() => {
            void handleExport();
          }}
          style={[styles.exportButton, !canExport && styles.exportButtonDisabled]}
        >
          <Text style={styles.exportButtonText}>
            {exportStatus === "exporting" ? "Exporting..." : "Export CSV"}
          </Text>
        </Pressable>
      </View>
      {exportStatus === "done" ? <Text style={styles.status}>CSV exported.</Text> : null}
      {exportStatus === "error" ? <Text style={styles.error}>Export failed.</Text> : null}
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.question}>{item.questionText}</Text>
          <Text style={styles.meta}>Answered: {item.selectedAnswer}</Text>
          <Text style={styles.meta}>Correct: {item.correctAnswer}</Text>
          <Text style={item.isCorrect ? styles.correct : styles.incorrect}>
            {item.isCorrect ? `Correct +${item.points}` : "Incorrect"}
          </Text>
        </View>
      ))}
      {items.length === 0 ? <Text style={styles.empty}>No answered questions yet.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, padding: 20, paddingTop: 84 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { color: "#fff", flex: 1, fontSize: 26, fontWeight: "900" },
  exportButton: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 8,
    minHeight: 42,
    minWidth: 112,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonText: { color: "#101625", fontSize: 14, fontWeight: "900" },
  card: { backgroundColor: "#17213b", borderRadius: 8, padding: 16 },
  question: { color: "#fff", fontSize: 16, fontWeight: "900", lineHeight: 22 },
  meta: { color: "#d8e2ff", fontSize: 14, fontWeight: "700", marginTop: 6 },
  correct: { color: "#76db8b", fontSize: 14, fontWeight: "900", marginTop: 8 },
  incorrect: { color: "#ff8e8e", fontSize: 14, fontWeight: "900", marginTop: 8 },
  status: { color: "#76db8b", fontSize: 14, fontWeight: "800" },
  error: { color: "#ff8e8e", fontSize: 14, fontWeight: "800" },
  empty: { color: "#d8e2ff", fontSize: 16, fontWeight: "700" },
});
