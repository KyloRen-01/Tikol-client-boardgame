import { useCallback, useMemo, useState } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { DiceFace } from "../../store/gameStore";
import { useGameStore } from "../../store/gameStore";

const DICE_SIZE = 86;
const FULL_SPIN_DEGREES = 1080;
const ROLL_DURATION_MS = 760;

const DICE_IMAGES: Record<DiceFace, ImageSourcePropType> = {
  1: require("../../../assets/dice/dice-1.png"),
  2: require("../../../assets/dice/dice-2.png"),
  3: require("../../../assets/dice/dice-3.png"),
  4: require("../../../assets/dice/dice-4.png"),
  5: require("../../../assets/dice/dice-5.png"),
  6: require("../../../assets/dice/dice-6.png"),
};

function rollDie(): DiceFace {
  return (Math.floor(Math.random() * 6) + 1) as DiceFace;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function targetSpin(current: number) {
  return current + FULL_SPIN_DEGREES + normalizeDegrees(0 - normalizeDegrees(current));
}

export function Dice() {
  const diceResult = useGameStore((state) => state.diceResult);
  const isGameFinished = useGameStore((state) => state.isGameFinished);
  const setDiceResult = useGameStore((state) => state.setDiceResult);
  const movePlayer = useGameStore((state) => state.movePlayer);
  const [isRolling, setIsRolling] = useState(false);
  const isDisabled = isRolling || isGameFinished;

  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const diceImage = useMemo(() => DICE_IMAGES[diceResult], [diceResult]);

  const finishRoll = useCallback(
    (nextResult: DiceFace) => {
      movePlayer(nextResult);
      setIsRolling(false);
    },
    [movePlayer],
  );

  const handlePress = useCallback(() => {
    if (isDisabled) {
      return;
    }

    const nextResult = rollDie();
    const nextRotateZ = targetSpin(rotateZ.value);
    const timingConfig = {
      duration: ROLL_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    };

    setIsRolling(true);
    setDiceResult(nextResult);

    scale.value = withSpring(1.08, { damping: 9, stiffness: 180 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 220 });
    });
    rotateZ.value = withTiming(
      nextRotateZ,
      timingConfig,
      (finished) => {
        if (finished) {
          runOnJS(finishRoll)(nextResult);
        }
      },
    );
  }, [finishRoll, isDisabled, rotateZ, scale, setDiceResult]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 620 },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Pressable
      accessibilityLabel="Roll dice"
      accessibilityRole="button"
      disabled={isDisabled}
      hitSlop={8}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      <Animated.View
        accessibilityLabel={`Dice showing ${diceResult}`}
        style={[styles.die, animatedStyle]}
      >
        <Image
          resizeMode="contain"
          source={diceImage}
          style={styles.diceImage}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    height: DICE_SIZE + 12,
    justifyContent: "center",
    width: DICE_SIZE + 12,
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.62,
  },
  die: {
    alignItems: "center",
    height: DICE_SIZE,
    justifyContent: "center",
    width: DICE_SIZE,
  },
  diceImage: {
    height: DICE_SIZE,
    width: DICE_SIZE,
  },
});
