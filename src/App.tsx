import { StatusBar } from "expo-status-bar";
import { lazy, Suspense, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BackButton } from "./components/BackButton";
import { useDatabaseLifecycle } from "./db/useDatabaseLifecycle";
import { HomeScreen } from "./screens/HomeScreen";
import { NameInputScreen } from "./screens/NameInputScreen";
import { useGameStore } from "./store/gameStore";
import { useNavigationStore } from "./store/useNavigationStore";

const CharacterSelectionScreen = lazy(() =>
  import("./screens/CharacterSelectionScreen").then((module) => ({
    default: module.CharacterSelectionScreen,
  })),
);

const GameBoardScreen = lazy(() =>
  import("./screens/GameBoardScreen").then((module) => ({
    default: module.GameBoardScreen,
  })),
);

export default function App() {
  const currentScreen = useNavigationStore((state) => state.currentScreen);
  const goTo = useNavigationStore((state) => state.goTo);
  const hydrateSession = useGameStore((state) => state.hydrateSession);
  useDatabaseLifecycle();

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const path = window.location.pathname;

    if (path === "/game") {
      goTo("GAME_BOARD");
    }
  }, [goTo]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.shell}>
        {currentScreen !== "HOME" ? <BackButton /> : null}
        {currentScreen === "HOME" ? <HomeScreen /> : null}
        {currentScreen === "NAME_INPUT" ? <NameInputScreen /> : null}
        <Suspense fallback={null}>
          {currentScreen === "CHARACTER_SELECTION" ? <CharacterSelectionScreen /> : null}
          {currentScreen === "GAME_BOARD" ? <GameBoardScreen /> : null}
        </Suspense>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101625",
  },
  shell: {
    flex: 1,
    backgroundColor: "#101625",
  },
});
