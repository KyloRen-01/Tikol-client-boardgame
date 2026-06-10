import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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

const DICE_SIZE = 74;
const DOT_SIZE = 11;
const FULL_SPIN_DEGREES = 720;
const ROLL_DURATION_MS = 760;

type Rotation = { x: number; y: number; z: number };

const FACE_ROTATIONS: Record<DiceFace, Rotation> = {
  1: { x: 0, y: 0, z: 0 },
  2: { x: 0, y: -90, z: 0 },
  3: { x: -90, y: 0, z: 0 },
  4: { x: 90, y: 0, z: 0 },
  5: { x: 0, y: 90, z: 0 },
  6: { x: 180, y: 0, z: 0 },
};

const FACE_PLACEMENTS: Record<DiceFace, Rotation> = {
  1: { x: 0, y: 0, z: 0 },
  2: { x: 0, y: 90, z: 0 },
  3: { x: 90, y: 0, z: 0 },
  4: { x: -90, y: 0, z: 0 },
  5: { x: 0, y: -90, z: 0 },
  6: { x: 180, y: 0, z: 0 },
};

const DOT_INDEXES_BY_FACE: Record<DiceFace, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function rollDie(): DiceFace {
  return (Math.floor(Math.random() * 6) + 1) as DiceFace;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function targetRotation(current: number, landing: number, spins: number) {
  return current + spins + normalizeDegrees(landing - normalizeDegrees(current));
}

function DiceDots({ value }: { value: DiceFace }) {
  return (
    <View style={styles.dotGrid}>
      {Array.from({ length: 9 }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dotSlot,
            DOT_INDEXES_BY_FACE[value].includes(index) ? styles.dot : null,
          ]}
        />
      ))}
    </View>
  );
}

function DiceCubeFace({ value }: { value: DiceFace }) {
  const placement = FACE_PLACEMENTS[value];

  return (
    <View
      style={[
        styles.face,
        {
          transform: [
            { rotateX: `${placement.x}deg` },
            { rotateY: `${placement.y}deg` },
            { rotateZ: `${placement.z}deg` },
          ],
        },
      ]}
    >
      <DiceDots value={value} />
    </View>
  );
}

export function Dice() {
  const diceResult = useGameStore((state) => state.diceResult);
  const setDiceResult = useGameStore((state) => state.setDiceResult);
  const movePlayer = useGameStore((state) => state.movePlayer);
  const [isRolling, setIsRolling] = useState(false);

  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const visibleFaces = useMemo(
    () => ([1, 2, 3, 4, 5, 6] satisfies DiceFace[]),
    [],
  );

  const finishRoll = useCallback(
    (nextResult: DiceFace) => {
      movePlayer(nextResult);
      setIsRolling(false);
    },
    [movePlayer],
  );

  const handlePress = useCallback(() => {
    if (isRolling) {
      return;
    }

    const nextResult = rollDie();
    const landingRotation = FACE_ROTATIONS[nextResult];
    const nextRotateX = targetRotation(
      rotateX.value,
      landingRotation.x,
      FULL_SPIN_DEGREES * 2,
    );
    const nextRotateY = targetRotation(
      rotateY.value,
      landingRotation.y,
      FULL_SPIN_DEGREES * 2,
    );
    const nextRotateZ = targetRotation(
      rotateZ.value,
      landingRotation.z,
      FULL_SPIN_DEGREES,
    );
    const timingConfig = {
      duration: ROLL_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    };

    setIsRolling(true);
    setDiceResult(nextResult);

    scale.value = withSpring(1.08, { damping: 9, stiffness: 180 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 220 });
    });
    rotateX.value = withTiming(nextRotateX, timingConfig);
    rotateY.value = withTiming(nextRotateY, timingConfig);
    rotateZ.value = withTiming(
      nextRotateZ,
      timingConfig,
      (finished) => {
        if (finished) {
          runOnJS(finishRoll)(nextResult);
        }
      },
    );
  }, [finishRoll, isRolling, rotateX, rotateY, rotateZ, scale, setDiceResult]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 620 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { rotateZ: `${rotateZ.value}deg` },
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
      <Animated.View
        accessibilityLabel={`Dice showing ${diceResult}`}
        style={[styles.die, animatedStyle]}
      >
        {visibleFaces.map((face) => (
          <DiceCubeFace key={face} value={face} />
        ))}
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
    position: "absolute",
    width: DICE_SIZE - 18,
  },
  dotGrid: {
    alignContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    height: DICE_SIZE - 34,
    justifyContent: "space-between",
    width: DICE_SIZE - 34,
  },
  dotSlot: {
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
  dot: {
    backgroundColor: "#221406",
    borderRadius: DOT_SIZE / 2,
  },
});
