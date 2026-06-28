import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BackButton } from "./components/BackButton";
import { useDatabaseLifecycle } from "./db/useDatabaseLifecycle";
import { DiagnosticErrorBoundary } from "./diagnostics/DiagnosticErrorBoundary";
import { diag, diagError } from "./diagnostics/diagnosticLog";
import { useStartupDiagnostics } from "./diagnostics/useStartupDiagnostics";
import { CharacterSelectionScreen } from "./screens/CharacterSelectionScreen";
import { GameBoardScreen } from "./screens/GameBoardScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { NameInputScreen } from "./screens/NameInputScreen";
import { HistoryBoardsScreen } from "./screens/HistoryBoardsScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { SessionDetailScreen } from "./screens/SessionDetailScreen";
import { StartupLoadingScreen } from "./screens/StartupLoadingScreen";
import { useNavigationStore } from "./store/useNavigationStore";

const MIN_STARTUP_LOADING_MS = 1100;

export default function App() {
  return (
    <DiagnosticErrorBoundary>
      <AppShell />
    </DiagnosticErrorBoundary>
  );
}

function AppShell() {
  const currentScreen = useNavigationStore((state) => state.currentScreen);
  const goTo = useNavigationStore((state) => state.goTo);
  const { ready, error } = useStartupDiagnostics();
  const [startupIntroDone, setStartupIntroDone] = useState(false);
  useDatabaseLifecycle();

  useEffect(() => {
    diag("app.mounted");
    return () => diag("app.unmounted");
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (window.location.pathname === "/game") goTo("GAME_BOARD");
    } catch (caught) {
      diagError("app.web-path.failed", caught);
    }
  }, [goTo]);

  useEffect(() => {
    const timer = setTimeout(
      () => setStartupIntroDone(true),
      MIN_STARTUP_LOADING_MS,
    );

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <ScrollView contentContainerStyle={styles.diagnosticRoot}>
        <Text style={styles.diagnosticTitle}>Startup failed</Text>
        <Text style={styles.diagnosticText}>{error}</Text>
      </ScrollView>
    );
  }

  if (!ready || !startupIntroDone) {
    return <StartupLoadingScreen />;
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        currentScreen === "GAME_BOARD" ? styles.gameSafeArea : null,
      ]}
    >
      <StatusBar style={currentScreen === "GAME_BOARD" ? "dark" : "light"} />
      <View
        style={[
          styles.shell,
          currentScreen === "GAME_BOARD" ? styles.gameShell : null,
        ]}
      >
        {currentScreen !== "HOME" &&
        currentScreen !== "GAME_BOARD" &&
        currentScreen !== "LOADING" ? (
          <BackButton />
        ) : null}
        {currentScreen === "HOME" ? <WelcomeScreen /> : null}
        {currentScreen === "NAME_INPUT" ? <NameInputScreen /> : null}
        {currentScreen === "HISTORY_BOARDS" ? <HistoryBoardsScreen /> : null}
        {currentScreen === "SESSION_DETAIL" ? <SessionDetailScreen /> : null}
        {currentScreen === "CHARACTER_SELECTION" ? (
          <CharacterSelectionScreen />
        ) : null}
        {currentScreen === "LOADING" ? <LoadingScreen /> : null}
        {currentScreen === "GAME_BOARD" ? <GameBoardScreen /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  diagnosticRoot: {
    backgroundColor: "#101625",
    flexGrow: 1,
    padding: 18,
    paddingTop: 56,
  },
  diagnosticText: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 17,
  },
  diagnosticTitle: {
    color: "#ff8e8e",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#101625",
  },
  shell: {
    flex: 1,
    backgroundColor: "#101625",
  },
  gameSafeArea: {
    backgroundColor: "#101625",
  },
  gameShell: {
    backgroundColor: "#101625",
  },
});
