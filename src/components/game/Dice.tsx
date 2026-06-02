import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { DiceFace } from "../../store/gameStore";
import { useGameStore } from "../../store/gameStore";

const DICE_SIZE = 74;

function rollDie(): DiceFace {
  return (Math.floor(Math.random() * 6) + 1) as DiceFace;
}

export function Dice() {
  const diceResult = useGameStore((state) => state.diceResult);
  const setDiceResult = useGameStore((state) => state.setDiceResult);
  const movePlayer = useGameStore((state) => state.movePlayer);
  const [isRolling, setIsRolling] = useState(false);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const finishRoll = useCallback(() => {
    const nextResult = rollDie();

    setDiceResult(nextResult);
    movePlayer(nextResult);
    setIsRolling(false);
  }, [movePlayer, setDiceResult]);

  const handlePress = useCallback(() => {
    if (isRolling) {
      return;
    }

    setIsRolling(true);
    scale.value = withSequence(
      withSpring(1.16, { damping: 7, stiffness: 240 }),
      withSpring(0.94, { damping: 8, stiffness: 260 }),
      withSpring(1, { damping: 9, stiffness: 260 }),
    );
    translateX.value = withSequence(
      withTiming(-8, { duration: 80 }),
      withTiming(9, { duration: 90 }),
      withTiming(-6, { duration: 80 }),
      withTiming(6, { duration: 80 }),
      withTiming(0, { duration: 120 }),
    );
    translateY.value = withSequence(
      withTiming(6, { duration: 80 }),
      withTiming(-8, { duration: 90 }),
      withTiming(5, { duration: 80 }),
      withTiming(-4, { duration: 80 }),
      withTiming(0, { duration: 120 }),
    );
    rotation.value = withSequence(
      withTiming(rotation.value + 160, { duration: 120 }),
      withTiming(rotation.value + 340, { duration: 160 }),
      withTiming(rotation.value + 520, { duration: 160 }),
      withSpring(rotation.value + 720, { damping: 12, stiffness: 140 }, () => {
        runOnJS(finishRoll)();
      }),
    );
  }, [finishRoll, isRolling, rotation, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Pressable
      accessibilityLabel="Roll dice"
      accessibilityRole="button"
      disabled={isRolling}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !isRolling ? styles.pressed : null,
      ]}
    >
      <Animated.View style={[styles.die, animatedStyle]}>
        <View style={styles.face}>
          <Text style={styles.value}>{diceResult}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    height: DICE_SIZE,
    justifyContent: "center",
    width: DICE_SIZE,
  },
  pressed: {
    opacity: 0.9,
  },
  die: {
    alignItems: "center",
    backgroundColor: "#fff7df",
    borderColor: "#382412",
    borderRadius: 14,
    borderWidth: 3,
    height: DICE_SIZE,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    width: DICE_SIZE,
  },
  face: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#f3c34d",
    borderRadius: 10,
    borderWidth: 2,
    height: DICE_SIZE - 18,
    justifyContent: "center",
    width: DICE_SIZE - 18,
  },
  value: {
    color: "#221406",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 38,
  },
});
