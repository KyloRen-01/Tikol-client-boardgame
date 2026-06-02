import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Board from "../../components/Board";
import { Dice } from "../components/game/Dice";
import { PlayerAvatar } from "../components/game/PlayerAvatar";
import { useGameStore } from "../store/gameStore";
import { usePlayerStore } from "../store/usePlayerStore";

const FIGMA_WIDTH = 279.58;
const FIGMA_HEIGHT = 1080;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
const ICON_BASE_SIZE = 80;
const ICON_MIN_SIZE = 30;
const ICON_MAX_SIZE = 120;
const MOBILE_WIDTH_MAX = 480;
const MOBILE_ICON_SCALE = 0.2;

export function GameBoardScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const session = usePlayerStore((state) => state.currentSession);
  const player = usePlayerStore((state) => state.player);
  const diceResult = useGameStore((state) => state.diceResult);
  const currentTileIndex = useGameStore((state) => state.currentTileIndex);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const boardWidth = screenWidth;
  const boardHeight = boardWidth * ASPECT_RATIO;
  const scaleX = boardWidth / FIGMA_WIDTH;
  const characterId =
    session?.characterId ?? player?.selectedCharacter ?? "Solid";
  const iconScale = screenWidth <= MOBILE_WIDTH_MAX ? MOBILE_ICON_SCALE : 1;
  const iconSize = Math.max(
    ICON_MIN_SIZE,
    Math.min(ICON_BASE_SIZE * scaleX * iconScale, ICON_MAX_SIZE),
  );

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <Dice />
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {player?.name ?? "Player"} - {characterId} - Tile{" "}
            {currentTileIndex} - {currentPhase} - Rolled {diceResult}
          </Text>
        </View>
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.boardContent}
      >
        <Board width={boardWidth} height={boardHeight}>
          <PlayerAvatar
            boardHeight={boardHeight}
            boardWidth={boardWidth}
            characterId={characterId}
            size={iconSize}
          />
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
  counter: {
    backgroundColor: "#222",
    borderRadius: 8,
    marginLeft: 12,
    maxWidth: 280,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  counterText: {
    color: "#f4c542",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  boardContent: {
    alignItems: "center",
  },
});
