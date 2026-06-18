import { Pressable, StyleSheet, Text, View } from "react-native";
import { HomeCanvas } from "../components/home/HomeCanvas";
import { useNavigationStore } from "../store/useNavigationStore";

export function HomeScreen() {
  const goNext = useNavigationStore((state) => state.goNext);
  const goTo = useNavigationStore((state) => state.goTo);

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={goNext} style={styles.pressable}>
        <HomeCanvas />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => goTo("HISTORY_BOARDS")}
        style={styles.historyButton}
      >
        <Text style={styles.historyText}>History Boards</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101625",
  },
  pressable: {
    flex: 1,
  },
  historyButton: {
    alignSelf: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 12,
    bottom: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "absolute",
  },
  historyText: {
    color: "#101625",
    fontSize: 16,
    fontWeight: "900",
  },
});
