import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Board from "../../components/Board";
import GameButton from "../../components/gamebutton";
import tiles from "../../lib/store/useTileStore";
import { CharacterIcon } from "../components/character/CharacterIcon";
import { usePlayerStore } from "../store/usePlayerStore";

const FIGMA_WIDTH = 279.58;
const FIGMA_HEIGHT = 1080;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
const ICON_BASE_SIZE = 80;
const ICON_MIN_SIZE = 40;
const ICON_MAX_SIZE = 120;
const MOBILE_WIDTH_MAX = 480;
const MOBILE_ICON_SCALE = 0.3;

export function GameBoardScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const session = usePlayerStore((state) => state.currentSession);
  const player = usePlayerStore((state) => state.player);
  const setCurrentTile = usePlayerStore((state) => state.setCurrentTile);
  const boardWidth = screenWidth;
  const boardHeight = boardWidth * ASPECT_RATIO;
  const scaleX = boardWidth / FIGMA_WIDTH;
  const scaleY = boardHeight / FIGMA_HEIGHT;
  const currentTileId = session?.tileId ?? 1;
  const characterId = session?.characterId ?? player?.selectedCharacter ?? "Solid";
  const iconScale = screenWidth <= MOBILE_WIDTH_MAX ? MOBILE_ICON_SCALE : 1;
  const iconSize = Math.max(
    ICON_MIN_SIZE,
    Math.min(ICON_BASE_SIZE * scaleX * iconScale, ICON_MAX_SIZE),
  );

  const currentTile = useMemo(() => {
    return tiles.find((tile) => tile.id === currentTileId) ?? tiles[0];
  }, [currentTileId]);

  const iconLeft = currentTile.x * scaleX - iconSize / 2;
  const iconTop = currentTile.y * scaleY - iconSize / 2;
  const totalTiles = tiles.length;

  const iconX = useSharedValue(iconLeft);
  const iconY = useSharedValue(iconTop);

  useEffect(() => {
    iconX.value = withTiming(iconLeft, { duration: 260 });
    iconY.value = withTiming(iconTop, { duration: 260 });
  }, [iconLeft, iconTop, iconX, iconY]);

  const iconStyle = useAnimatedStyle(() => ({
    left: iconX.value,
    top: iconY.value,
  }));

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonSpacing}>
            <GameButton
              label="Prev"
              onPress={() => setCurrentTile(currentTileId === 1 ? totalTiles : currentTileId - 1)}
            />
          </View>
          <GameButton label="Move" onPress={() => setCurrentTile((currentTileId % totalTiles) + 1)} />
        </View>
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {player?.name ?? "Player"} - {characterId} - Tile {currentTileId}
          </Text>
        </View>
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.boardContent}
      >
        <Board width={boardWidth} height={boardHeight}>
          <Animated.View style={[styles.piece, iconStyle]}>
            <CharacterIcon characterId={characterId} size={iconSize} />
          </Animated.View>
        </Board>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 8,
    paddingTop: 68,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpacing: {
    marginRight: 12,
  },
  counter: {
    backgroundColor: "#222",
    borderRadius: 12,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  counterText: {
    color: "#f4c542",
    fontSize: 14,
    fontWeight: "700",
  },
  boardContent: {
    alignItems: "center",
  },
  piece: {
    position: "absolute",
  },
});
