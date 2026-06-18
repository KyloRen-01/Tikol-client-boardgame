import { Pressable, StyleSheet, Text, View } from "react-native";
import { useGameStore } from "../../store/gameStore";

export function GameTopBar() {
  const endSession = useGameStore((state) => state.endSession);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void endSession();
        }}
        style={({ pressed }) => [styles.exitButton, pressed ? styles.pressed : null]}
      >
        <Text style={styles.exitText}>Exit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    left: 0,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingTop: 10,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
  },
  exitButton: {
    alignItems: "center",
    backgroundColor: "#7d1f2f",
    borderRadius: 999,
    minWidth: 78,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
  },
  pressed: {
    opacity: 0.82,
  },
  exitText: {
    color: "#fffaf1",
    fontSize: 14,
    fontWeight: "900",
  },
});
