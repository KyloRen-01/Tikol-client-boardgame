import { useEffect } from "react";
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Board from "../../components/Board";
import { Dice } from "../components/game/Dice";
import { PlayerAvatar } from "../components/game/PlayerAvatar";
import { QuestionModal } from "../components/game/QuestionModal";
import { QuestionTrigger } from "../components/game/QuestionTrigger";
import { QUESTION_TILE_INDEXES, useGameStore } from "../store/gameStore";
import { usePlayerStore } from "../store/usePlayerStore";

const FIGMA_WIDTH = 281;
const FIGMA_HEIGHT = 2405;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
const ICON_BASE_SIZE = 25;
const ICON_MIN_SIZE = 20;
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
  const sessionToken = useGameStore((state) => state.sessionToken);
  const initializeSession = useGameStore((state) => state.initializeSession);
  const movePlayer = useGameStore((state) => state.movePlayer);
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

  useEffect(() => {
    if (!sessionToken) {
      void initializeSession();
    }
  }, [initializeSession, sessionToken]);

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <Dice />
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {player?.name ?? "Player"} - {characterId} - Tile{" "}
            {currentTileIndex + 1} - {currentPhase} - Rolled {diceResult}
          </Text>
        </View>
        <View style={styles.tileControls}>
          <Pressable
            accessibilityLabel="Move player back one tile"
            onPress={() => movePlayer(-1)}
            style={({ pressed }) => [
              styles.tileControlButton,
              pressed ? styles.tileControlButtonPressed : null,
            ]}
          >
            <Text style={styles.tileControlText}>Back</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Move player forward one tile"
            onPress={() => movePlayer(1)}
            style={({ pressed }) => [
              styles.tileControlButton,
              pressed ? styles.tileControlButtonPressed : null,
            ]}
          >
            <Text style={styles.tileControlText}>Forward</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.boardContent}
      >
        <Board width={boardWidth} height={boardHeight}>
          {QUESTION_TILE_INDEXES.map((tileIndex) => (
            <QuestionTrigger
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              key={tileIndex}
              size={Math.max(18, iconSize * 0.82)}
              tileIndex={tileIndex}
            />
          ))}
          <PlayerAvatar
            boardHeight={boardHeight}
            boardWidth={boardWidth}
            characterId={characterId}
            size={iconSize}
          />
        </Board>
      </ScrollView>
      <QuestionModal />
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
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    paddingBottom: 8,
    paddingTop: 68,
  },
  counter: {
    backgroundColor: "#222",
    borderRadius: 8,
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
  tileControls: {
    flexDirection: "row",
    gap: 8,
  },
  tileControlButton: {
    backgroundColor: "#ffb12d",
    borderRadius: 8,
    minWidth: 88,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tileControlButtonPressed: {
    opacity: 0.78,
  },
  tileControlText: {
    color: "#221406",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  boardContent: {
    alignItems: "center",
  },
});
