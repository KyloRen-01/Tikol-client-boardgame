import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Share } from "react-native";
import type { QuestionHistoryItem } from "../types/game";

const CSV_HEADERS = ["questions", "user answer", "correct answer", "points gained"];

function escapeCsvValue(value: string | number) {
  const text = String(value);
  if (!/[",\r\n]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function buildSessionCsv(items: QuestionHistoryItem[]) {
  const rows = items.map((item) => [
    item.questionText,
    item.selectedAnswer,
    item.correctAnswer,
    item.points,
  ]);

  return [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n");
}

function getSessionExportFilename(sessionId: string) {
  const safeSessionId = sessionId.replace(/[^a-z0-9-]/gi, "-");
  return `tikol-session-${safeSessionId}.csv`;
}

function downloadCsv(filename: string, csv: string) {
  if (typeof document === "undefined") {
    return false;
  }

  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

async function shareCsvFile(filename: string, csv: string) {
  const file = new File(Paths.cache, filename);

  if (file.exists) {
    file.delete();
  }

  file.create({ intermediates: true });
  file.write(`\uFEFF${csv}`);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      dialogTitle: "Export session",
      mimeType: "text/csv",
      UTI: "public.comma-separated-values-text",
    });
    return;
  }

  await Share.share(
    {
      title: filename,
      message: csv,
    },
    {
      dialogTitle: "Export session",
      subject: filename,
    },
  );
}

export async function exportSessionForSheets(sessionId: string, items: QuestionHistoryItem[]) {
  const filename = getSessionExportFilename(sessionId);
  const csv = buildSessionCsv(items);

  if (Platform.OS === "web" && downloadCsv(filename, csv)) {
    return;
  }

  await shareCsvFile(filename, csv);
}
