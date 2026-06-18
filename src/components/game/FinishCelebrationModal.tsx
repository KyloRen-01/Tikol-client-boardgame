import { memo, useCallback, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { useGameStore } from "../../store/gameStore";
import { useScoreStore } from "../../store/scoreStore";

type ConfettiSpec = {
  color: string;
  delay: number;
  height: number;
  rotate: number;
  width: number;
  x: number;
  y: number;
};

type SparkleSpec = {
  color: string;
  delay: number;
  size: number;
  x: number;
  y: number;
};

const CARD_MARGIN = 14;
const CARD_MAX_WIDTH = 350;
const CARD_MIN_WIDTH = 210;

const CONFETTI: ConfettiSpec[] = [
  { color: "#ef4444", delay: 0.01, height: 16, rotate: 18, width: 7, x: -142, y: -58 },
  { color: "#2f8f46", delay: 0.08, height: 12, rotate: -32, width: 12, x: -98, y: -88 },
  { color: "#ffb12d", delay: 0.15, height: 17, rotate: 48, width: 7, x: -54, y: -70 },
  { color: "#1f78d1", delay: 0.2, height: 13, rotate: 28, width: 13, x: -12, y: -104 },
  { color: "#d946ef", delay: 0.27, height: 15, rotate: -18, width: 8, x: 34, y: -76 },
  { color: "#0f6b4c", delay: 0.34, height: 12, rotate: 60, width: 12, x: 78, y: -96 },
  { color: "#f97316", delay: 0.41, height: 17, rotate: -44, width: 7, x: 122, y: -62 },
  { color: "#38bdf8", delay: 0.49, height: 12, rotate: 12, width: 12, x: 150, y: -20 },
  { color: "#fde047", delay: 0.57, height: 16, rotate: -58, width: 7, x: -126, y: 6 },
  { color: "#fb7185", delay: 0.65, height: 13, rotate: 36, width: 13, x: -76, y: 22 },
  { color: "#34d399", delay: 0.74, height: 16, rotate: -10, width: 7, x: 58, y: 18 },
  { color: "#a78bfa", delay: 0.84, height: 13, rotate: 52, width: 13, x: 108, y: 4 },
];

const SPARKLES: SparkleSpec[] = [
  { color: "#fff7df", delay: 0.04, size: 7, x: -74, y: -30 },
  { color: "#ffdf6e", delay: 0.18, size: 10, x: -38, y: -78 },
  { color: "#ffffff", delay: 0.32, size: 6, x: 8, y: -56 },
  { color: "#78ffd6", delay: 0.46, size: 8, x: 58, y: -70 },
  { color: "#fff7df", delay: 0.6, size: 7, x: 86, y: -22 },
  { color: "#ffdf6e", delay: 0.76, size: 9, x: -92, y: 18 },
  { color: "#ffffff", delay: 0.9, size: 6, x: 74, y: 30 },
];

function ConfettiPiece({
  anchorX,
  anchorY,
  progress,
  spec,
}: {
  anchorX: number;
  anchorY: number;
  progress: SharedValue<number>;
  spec: ConfettiSpec;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const cycle = (progress.value + spec.delay) % 1;
    const sideDrift = Math.sin(cycle * Math.PI * 2) * 18;
    const lift = Math.sin(cycle * Math.PI) * 34;
    const fall = cycle * 142;

    return {
      opacity: cycle < 0.86 ? 1 - cycle * 0.72 : 0,
      transform: [
        { translateX: spec.x + sideDrift },
        { translateY: spec.y + fall - lift },
        { rotate: `${spec.rotate + cycle * 360}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.confettiPiece,
        {
          backgroundColor: spec.color,
          borderRadius: Math.min(spec.width, spec.height) / 2,
          height: spec.height,
          left: anchorX,
          top: anchorY,
          width: spec.width,
        },
        animatedStyle,
      ]}
    />
  );
}

function SparkleDot({
  anchorX,
  anchorY,
  progress,
  spec,
}: {
  anchorX: number;
  anchorY: number;
  progress: SharedValue<number>;
  spec: SparkleSpec;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const cycle = (progress.value + spec.delay) % 1;
    const twinkle = Math.sin(cycle * Math.PI);

    return {
      opacity: 0.12 + twinkle * 0.82,
      transform: [
        { translateX: spec.x },
        { translateY: spec.y },
        { scale: 0.45 + twinkle * 1.15 },
        { rotate: `${cycle * 180}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sparkle,
        {
          backgroundColor: spec.color,
          height: spec.size,
          left: anchorX,
          top: anchorY,
          width: spec.size,
        },
        animatedStyle,
      ]}
    />
  );
}

function PulseRing({
  anchorX,
  anchorY,
  delay,
  progress,
}: {
  anchorX: number;
  anchorY: number;
  delay: number;
  progress: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const cycle = (progress.value + delay) % 1;

    return {
      opacity: (1 - cycle) * 0.72,
      transform: [{ scale: 0.54 + cycle * 1.95 }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulseRing,
        {
          left: anchorX - 24,
          top: anchorY - 24,
        },
        animatedStyle,
      ]}
    />
  );
}

export const FinishCelebrationModal = memo(function FinishCelebrationModal() {
  const { height, width } = useWindowDimensions();
  const isGameFinished = useGameStore((state) => state.isGameFinished);
  const initializeSession = useGameStore((state) => state.initializeSession);
  const score = useScoreStore((state) => state.score);
  const [dismissed, setDismissed] = useState(false);
  const entrance = useSharedValue(0);
  const pulse = useSharedValue(0);
  const confetti = useSharedValue(0);
  const anchor = {
    x: width / 2,
    y: height / 2,
  };
  const cardWidth = Math.min(
    CARD_MAX_WIDTH,
    Math.max(CARD_MIN_WIDTH, width - CARD_MARGIN * 2),
  );

  useEffect(() => {
    if (!isGameFinished) {
      setDismissed(false);
      entrance.value = 0;
      pulse.value = 0;
      confetti.value = 0;
      return;
    }

    entrance.value = withDelay(
      90,
      withSpring(1, { damping: 11, mass: 0.72, stiffness: 150 }),
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false,
    );
    confetti.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.linear }),
      -1,
      false,
    );
  }, [confetti, entrance, isGameFinished, pulse]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const visibleProgress = Math.min(1, entrance.value);

    return {
      opacity: visibleProgress,
      transform: [
        { translateY: (1 - visibleProgress) * 22 },
        { scale: 0.82 + visibleProgress * 0.18 },
      ],
    };
  });
  const glowAnimatedStyle = useAnimatedStyle(() => {
    const glow = 1 + Math.sin(pulse.value * Math.PI) * 0.18;

    return {
      opacity: 0.76 + Math.sin(pulse.value * Math.PI) * 0.22,
      transform: [{ scale: glow }],
    };
  });
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + Math.sin(pulse.value * Math.PI * 2) * 0.025,
      },
    ],
  }));
  const medalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${Math.sin(pulse.value * Math.PI * 2) * 7}deg` },
      { scale: 1 + Math.sin(pulse.value * Math.PI) * 0.05 },
    ],
  }));

  const handlePlayAgain = useCallback(() => {
    void initializeSession();
  }, [initializeSession]);

  if (!isGameFinished || dismissed) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.backdrop} />
      <View pointerEvents="none" style={styles.effectsLayer}>
        <PulseRing anchorX={anchor.x} anchorY={anchor.y} delay={0} progress={pulse} />
        <PulseRing anchorX={anchor.x} anchorY={anchor.y} delay={0.38} progress={pulse} />
        <Animated.View
          style={[
            styles.centerGlow,
            { left: anchor.x - 92, top: anchor.y - 92 },
            glowAnimatedStyle,
          ]}
        />
        {SPARKLES.map((spec) => (
          <SparkleDot
            anchorX={anchor.x}
            anchorY={anchor.y}
            key={`${spec.x}-${spec.y}-${spec.delay}`}
            progress={confetti}
            spec={spec}
          />
        ))}
        {CONFETTI.map((spec) => (
          <ConfettiPiece
            anchorX={anchor.x}
            anchorY={anchor.y}
            key={`${spec.x}-${spec.y}-${spec.delay}`}
            progress={confetti}
            spec={spec}
          />
        ))}
      </View>

      <Animated.View
        accessibilityRole="alert"
        accessibilityViewIsModal
        style={[
          styles.card,
          { width: cardWidth },
          cardAnimatedStyle,
        ]}
      >
        <Animated.View style={[styles.medal, medalAnimatedStyle]}>
          <View style={styles.medalInner}>
            <Text style={styles.medalText}>100</Text>
          </View>
        </Animated.View>
        <Animated.Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.title, titleAnimatedStyle]}
        >
          You Finished!
        </Animated.Text>
        <Text style={styles.subtitle}>Final tile reached</Text>
        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>Final Score</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.scoreValue}>
            {score}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={handlePlayAgain}
            style={({ pressed }) => [
              styles.actionButton,
              styles.primaryButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>Play Again</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDismissed(true)}
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.secondaryButtonText}>View Board</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderRadius: 12,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    width: "100%",
  },
  actions: {
    gap: 8,
    marginTop: 14,
    width: "100%",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 17, 17, 0.46)",
  },
  centerGlow: {
    backgroundColor: "rgba(255, 177, 45, 0.18)",
    borderColor: "rgba(255, 247, 223, 0.72)",
    borderRadius: 92,
    borderWidth: 2,
    height: 184,
    position: "absolute",
    shadowColor: "#ffdf6e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.48,
    shadowRadius: 18,
    width: 184,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff7df",
    borderColor: "#382412",
    borderRadius: 18,
    borderWidth: 3,
    elevation: 12,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    zIndex: 4,
  },
  confettiPiece: {
    position: "absolute",
  },
  effectsLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  medal: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderColor: "#7d1f2f",
    borderRadius: 31,
    borderWidth: 3,
    height: 62,
    justifyContent: "center",
    position: "absolute",
    top: -32,
    width: 62,
  },
  medalInner: {
    alignItems: "center",
    backgroundColor: "#fff2b9",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  medalText: {
    color: "#7d1f2f",
    fontSize: 16,
    fontWeight: "900",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: CARD_MARGIN,
    zIndex: 8,
  },
  pressed: {
    opacity: 0.82,
  },
  primaryButton: {
    backgroundColor: "#2f8f46",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  pulseRing: {
    borderColor: "rgba(255, 223, 110, 0.92)",
    borderRadius: 24,
    borderWidth: 4,
    height: 48,
    position: "absolute",
    width: 48,
  },
  scoreLabel: {
    color: "#70440c",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  scorePill: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#f3c34d",
    borderRadius: 14,
    borderWidth: 2,
    marginTop: 14,
    minWidth: 132,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  scoreValue: {
    color: "#101625",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34,
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderColor: "#d6a127",
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: "#382412",
    fontSize: 15,
    fontWeight: "900",
  },
  sparkle: {
    borderRadius: 999,
    position: "absolute",
  },
  subtitle: {
    color: "#70440c",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3,
    textAlign: "center",
    textTransform: "uppercase",
  },
  title: {
    color: "#221406",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    textAlign: "center",
  },
});
