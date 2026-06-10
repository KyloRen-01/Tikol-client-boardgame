import { Pressable, StyleSheet, Text } from "react-native";
import { useGameStore } from "../store/gameStore";
import { useNavigationStore } from "../store/useNavigationStore";

export function BackButton() {
  const currentScreen = useNavigationStore((state) => state.currentScreen);
  const goBack = useNavigationStore((state) => state.goBack);
  const endSession = useGameStore((state) => state.endSession);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (currentScreen === "GAME_BOARD") {
          void endSession();
          return;
        }

        goBack();
      }}
      style={styles.button}
    >
      <Text style={styles.text}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    left: 16,
    position: "absolute",
    top: 16,
    zIndex: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
