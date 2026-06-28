import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const PARTICLES = [
  { left: "16%", top: "28%", size: 8, delay: 0 },
  { left: "82%", top: "22%", size: 6, delay: 180 },
  { left: "74%", top: "70%", size: 10, delay: 320 },
  { left: "24%", top: "76%", size: 7, delay: 460 },
] as const;

export function StartupLoadingScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        duration: 560,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        duration: 560,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          duration: 1050,
          easing: Easing.inOut(Easing.quad),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          duration: 1050,
          easing: Easing.inOut(Easing.quad),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [fade, progress, pulse, slide]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["12%", "100%"],
  });
  const particleScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });
  const particleOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.74],
  });

  return (
    <View style={styles.root}>
      {PARTICLES.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              height: particle.size,
              left: particle.left,
              opacity: particleOpacity,
              top: particle.top,
              transform: [{ scale: particleScale }],
              width: particle.size,
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.panel,
          {
            opacity: fade,
            transform: [{ translateY: slide }],
          },
        ]}
      >
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>T</Text>
        </View>
        <Text style={styles.brand}>TIKOL</Text>
        <Text style={styles.subtitle}>
          Particle Model of Matter Offline Game
        </Text>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.status}>Preparing your learning board</Text>
      </Animated.View>
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
  brand: {
    color: "#ffb12d",
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 52,
    marginTop: 16,
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#fff5df",
    borderColor: "#ffb12d",
    borderRadius: 22,
    borderWidth: 2,
    height: 74,
    justifyContent: "center",
    shadowColor: "#ffb12d",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    width: 74,
  },
  brandMarkText: {
    color: "#7d1f2f",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 44,
  },
  panel: {
    alignItems: "center",
    maxWidth: 420,
    width: "100%",
  },
  particle: {
    backgroundColor: "#45c780",
    borderRadius: 999,
    position: "absolute",
  },
  progressFill: {
    backgroundColor: "#ffb12d",
    borderRadius: 999,
    height: "100%",
  },
  progressTrack: {
    backgroundColor: "rgba(255, 245, 223, 0.18)",
    borderRadius: 999,
    height: 10,
    marginTop: 28,
    overflow: "hidden",
    width: "100%",
  },
  status: {
    color: "#d8c5a8",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff5df",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 6,
    textAlign: "center",
  },
});
