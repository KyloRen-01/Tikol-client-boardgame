import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { CreditsModal } from "./CreditsModal";
import { useNavigationStore } from "../store/useNavigationStore";

const PARTICLES = [
  { left: "15%", top: "24%", size: 9 },
  { left: "76%", top: "18%", size: 7 },
  { left: "83%", top: "66%", size: 10 },
  { left: "22%", top: "72%", size: 6 },
] as const;

export function WelcomeScreen() {
  const goTo = useNavigationStore((state) => state.goTo);
  const [isCreditsVisible, setIsCreditsVisible] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        duration: 620,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        duration: 620,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [fade, glow, slide]);

  const glowScale = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityLabel="Open credits"
        accessibilityRole="button"
        onPress={() => setIsCreditsVisible(true)}
        style={({ pressed }) => [
          styles.infoButton,
          pressed ? styles.infoButtonPressed : null,
        ]}
      >
        <Text style={styles.infoText}>i</Text>
      </Pressable>

      {PARTICLES.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              height: particle.size,
              left: particle.left,
              top: particle.top,
              width: particle.size,
              opacity: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.28, 0.72],
              }),
              transform: [{ scale: glowScale }],
            },
          ]}
        />
      ))}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fade,
            transform: [{ translateY: slide }],
          },
        ]}
      >
        <Text style={styles.brand}>TIKOL</Text>
        <Text style={styles.subtitle}>
          Technology-Integrated Knowledge for Observing Learning
        </Text>
        <Text style={styles.title}>Particle Model Board Game</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => goTo("NAME_INPUT")}
          style={({ pressed }) => [styles.startButton, pressed ? styles.startPressed : null]}
        >
          <Text style={styles.startText}>Start Game</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => goTo("HISTORY_BOARDS")}
          style={({ pressed }) => [styles.historyButton, pressed ? styles.startPressed : null]}
        >
          <Text style={styles.historyText}>History Boards</Text>
        </Pressable>
      </Animated.View>
      <CreditsModal
        onClose={() => setIsCreditsVisible(false)}
        visible={isCreditsVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    backgroundColor: "#101625",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: 28,
  },
  particle: {
    backgroundColor: "#ffb12d",
    borderRadius: 999,
    position: "absolute",
  },
  content: {
    alignItems: "center",
    backgroundColor: "#fff5df",
    borderColor: "#d9a645",
    borderRadius: 22,
    borderWidth: 1,
    maxWidth: 520,
    paddingHorizontal: 24,
    paddingVertical: 34,
    shadowColor: "#ffb12d",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    width: "100%",
  },
  brand: {
    color: "#7d1f2f",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: "#17213b",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 21,
    marginTop: 10,
    textAlign: "center",
  },
  title: {
    color: "#80652c",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 20,
    textAlign: "center",
  },
  startButton: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 14,
    marginTop: 28,
    minHeight: 52,
    paddingHorizontal: 34,
    paddingVertical: 15,
  },
  startPressed: {
    opacity: 0.84,
  },
  startText: {
    color: "#101625",
    fontSize: 17,
    fontWeight: "900",
  },
  historyButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  historyText: {
    color: "#7d1f2f",
    fontSize: 14,
    fontWeight: "900",
  },
  infoButton: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: 18,
    top: 18,
    width: 36,
    zIndex: 2,
  },
  infoButtonPressed: {
    opacity: 0.84,
  },
  infoText: {
    color: "#101625",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
});
