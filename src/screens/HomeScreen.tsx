import { Pressable, StyleSheet, View } from "react-native";
import { HomeCanvas } from "../components/home/HomeCanvas";
import { useNavigationStore } from "../store/useNavigationStore";

export function HomeScreen() {
  const goNext = useNavigationStore((state) => state.goNext);

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={goNext} style={styles.pressable}>
        <HomeCanvas />
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
});
