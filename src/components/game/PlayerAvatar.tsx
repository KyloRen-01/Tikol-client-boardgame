import { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import tiles from "../../../lib/store/useTileStore";
import { CharacterIcon } from "../character/CharacterIcon";
import { useGameStore } from "../../store/gameStore";
import type { CharacterId } from "../../types/game";

type PlayerAvatarProps = {
  boardWidth: number;
  boardHeight: number;
  characterId: CharacterId;
  size: number;
};

const FIGMA_WIDTH = 279.58;
const FIGMA_HEIGHT = 1080;
const STEP_DURATION_MS = 210;

function getTilePosition(tileIndex: number, scaleX: number, scaleY: number, size: number) {
  const boardTile = tiles[Math.max(0, Math.min(tileIndex, 50))] ?? tiles[0];

  return {
    x: boardTile.x * scaleX - size / 2,
    y: boardTile.y * scaleY - size / 2,
  };
}

function getTilePath(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) {
    return [toIndex];
  }

  const direction = fromIndex < toIndex ? 1 : -1;
  const path: number[] = [];

  for (let index = fromIndex + direction; ; index += direction) {
    path.push(index);

    if (index === toIndex) {
      break;
    }
  }

  return path;
}

export function PlayerAvatar({
  boardWidth,
  boardHeight,
  characterId,
  size,
}: PlayerAvatarProps) {
  const currentTileIndex = useGameStore((state) => state.currentTileIndex);
  const scaleX = boardWidth / FIGMA_WIDTH;
  const scaleY = boardHeight / FIGMA_HEIGHT;
  const previousTileIndex = useRef(currentTileIndex);
  const initialPosition = useMemo(
    () => getTilePosition(currentTileIndex, scaleX, scaleY, size),
    [currentTileIndex, scaleX, scaleY, size],
  );

  const x = useSharedValue(initialPosition.x);
  const y = useSharedValue(initialPosition.y);
  const hopScale = useSharedValue(1);

  useEffect(() => {
    const position = getTilePosition(previousTileIndex.current, scaleX, scaleY, size);

    x.value = position.x;
    y.value = position.y;
  }, [scaleX, scaleY, size, x, y]);

  useEffect(() => {
    const startTileIndex = previousTileIndex.current;
    const path = getTilePath(startTileIndex, currentTileIndex);

    previousTileIndex.current = currentTileIndex;

    const animatePathStep = (pathIndex: number) => {
      const nextTileIndex = path[pathIndex];

      if (nextTileIndex === undefined) {
        return;
      }

      const nextPosition = getTilePosition(nextTileIndex, scaleX, scaleY, size);

      hopScale.value = withSequence(
        withSpring(1.12, { damping: 8, stiffness: 220 }),
        withSpring(1, { damping: 9, stiffness: 220 }),
      );
      x.value = withTiming(nextPosition.x, { duration: STEP_DURATION_MS });
      y.value = withTiming(nextPosition.y, { duration: STEP_DURATION_MS }, (finished) => {
        if (finished) {
          runOnJS(animatePathStep)(pathIndex + 1);
        }
      });
    };

    animatePathStep(0);
  }, [currentTileIndex, hopScale, scaleX, scaleY, size, x, y]);

  const avatarStyle = useAnimatedStyle(() => ({
    left: x.value,
    top: y.value,
    transform: [{ scale: hopScale.value }],
  }));

  return (
    <Animated.View style={[styles.piece, avatarStyle]}>
      <CharacterIcon characterId={characterId} size={size} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
  },
});
