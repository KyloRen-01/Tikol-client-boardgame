import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useNavigationStore } from "../store/useNavigationStore";

const LOAD_DURATION_MS = 1900;

export function LoadingScreen() {
  const goTo = useNavigationStore((state) => state.goTo);
  const progress = useRef(new Animated.Value(0)).current;
  const spinner = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progressAnimation = Animated.timing(progress, {
      duration: LOAD_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: false,
    });
    const spinnerAnimation = Animated.loop(
      Animated.timing(spinner, {
        duration: 900,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    );
    const timer = setTimeout(() => goTo("GAME_BOARD"), LOAD_DURATION_MS);

    progressAnimation.start();
    spinnerAnimation.start();

    return () => {
      clearTimeout(timer);
      progressAnimation.stop();
      spinnerAnimation.stop();
    };
  }, [goTo, progress, spinner]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["8%", "100%"],
  });
  const rotate = spinner.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
      <Text style={styles.brand}>TIKOL</Text>
      <Text style={styles.title}>Particle Model of Matter Offline Game</Text>
      <Text style={styles.message}>Preparing your board...</Text>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    backgroundColor: "#101625",
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },
  spinner: {
    borderColor: "rgba(255, 177, 45, 0.22)",
    borderRadius: 28,
    borderRightColor: "#ffb12d",
    borderWidth: 5,
    height: 56,
    marginBottom: 22,
    width: 56,
  },
  brand: {
    color: "#ffb12d",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0,
  },
  title: {
    color: "#fff5df",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  message: {
    color: "#d8c5a8",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 14,
  },
  progressTrack: {
    backgroundColor: "rgba(255, 245, 223, 0.18)",
    borderRadius: 999,
    height: 10,
    marginTop: 24,
    maxWidth: 320,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    backgroundColor: "#ffb12d",
    borderRadius: 999,
    height: "100%",
  },
});
