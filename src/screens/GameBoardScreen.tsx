import { useCallback, useEffect, useRef } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Board from "../../components/Board";
import tiles from "../../lib/store/useTileStore";
import { AnswerFeedbackModal } from "../components/game/AnswerFeedbackModal";
import { BottomGameConsole } from "../components/game/BottomGameConsole";
import { BonusChallengeModal } from "../components/game/BonusChallengeModal";
import { BonusChallengeTrigger } from "../components/game/BonusChallengeTrigger";
import { GameAudioEffects } from "../components/game/GameAudioEffects";
import { FinishCelebrationModal } from "../components/game/FinishCelebrationModal";
import { GameTopBar } from "../components/game/GameTopBar";
import { PlayerAvatar } from "../components/game/PlayerAvatar";
import { QuestionModal } from "../components/game/QuestionModal";
import { QuestionTrigger } from "../components/game/QuestionTrigger";
import {
  BONUS_CHALLENGE_TILE_INDEXES,
  QUESTION_TILE_INDEXES,
  START_TILE_INDEX,
  useGameStore,
} from "../store/gameStore";
import { usePlayerStore } from "../store/usePlayerStore";

const FIGMA_WIDTH = 281;
const FIGMA_HEIGHT = 2405;
const ASPECT_RATIO = FIGMA_HEIGHT / FIGMA_WIDTH;
const ICON_BASE_SIZE = 28;
const ICON_MIN_SIZE = 30;
const ICON_MAX_SIZE = 120;
const QUESTION_BADGE_MIN_SIZE = 26;
const QUESTION_BADGE_SCALE = 0.92;
const TILE_TRACKING_CENTER_RATIO = 0.48;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function GameBoardScreen() {
  const boardScrollRef = useRef<ScrollView>(null);
  const boardViewportHeightRef = useRef(0);
  const { width: screenWidth } = useWindowDimensions();
  const session = usePlayerStore((state) => state.currentSession);
  const player = usePlayerStore((state) => state.player);
  const sessionToken = useGameStore((state) => state.sessionToken);
  const initializeSession = useGameStore((state) => state.initializeSession);
  const feedback = useGameStore((state) => state.feedback);
  const closeFeedback = useGameStore((state) => state.closeFeedback);
  const currentTileIndex = useGameStore((state) => state.currentTileIndex);
  const isGameFinished = useGameStore((state) => state.isGameFinished);
  const boardWidth = screenWidth;
  const boardHeight = boardWidth * ASPECT_RATIO;
  const scaleX = boardWidth / FIGMA_WIDTH;
  const characterId =
    session?.characterId ?? player?.selectedCharacter ?? "Solid";
  const iconSize = Math.max(
    ICON_MIN_SIZE,
    Math.min(ICON_BASE_SIZE * scaleX, ICON_MAX_SIZE),
  );
  const questionBadgeSize = Math.max(
    QUESTION_BADGE_MIN_SIZE,
    iconSize * QUESTION_BADGE_SCALE,
  );

  useEffect(() => {
    if (!sessionToken) {
      void initializeSession();
    }
  }, [initializeSession, sessionToken]);

  const scrollToBoardBottom = useCallback((animated = false) => {
    requestAnimationFrame(() => {
      boardScrollRef.current?.scrollToEnd({ animated });
    });
  }, []);

  const scrollToTile = useCallback(
    (tileIndex: number, animated = true) => {
      const viewportHeight = boardViewportHeightRef.current;

      if (!viewportHeight) {
        return;
      }

      const boardTile =
        tiles[Math.max(0, Math.min(tileIndex, tiles.length - 1))] ?? tiles[0];
      const maxScrollY = Math.max(0, boardHeight - viewportHeight);
      const targetY = clamp(
        boardTile.y * (boardHeight / FIGMA_HEIGHT) -
          viewportHeight * TILE_TRACKING_CENTER_RATIO,
        0,
        maxScrollY,
      );

      requestAnimationFrame(() => {
        boardScrollRef.current?.scrollTo({ animated, y: targetY });
      });
    },
    [boardHeight],
  );

  const syncBoardScrollPosition = useCallback(
    (animated = false) => {
      if (currentTileIndex === START_TILE_INDEX && !isGameFinished) {
        scrollToBoardBottom(animated);
        return;
      }

      scrollToTile(currentTileIndex, animated);
    },
    [currentTileIndex, isGameFinished, scrollToBoardBottom, scrollToTile],
  );

  const handleBoardLayout = useCallback(
    (event: LayoutChangeEvent) => {
      boardViewportHeightRef.current = event.nativeEvent.layout.height;
      syncBoardScrollPosition(false);
    },
    [syncBoardScrollPosition],
  );

  const handleAvatarTileStep = useCallback(
    (tileIndex: number) => {
      scrollToTile(tileIndex, true);
    },
    [scrollToTile],
  );

  useEffect(() => {
    if (isGameFinished || currentTileIndex !== START_TILE_INDEX) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      scrollToBoardBottom(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [currentTileIndex, isGameFinished, scrollToBoardBottom]);

  return (
    <View style={styles.root}>
      <GameTopBar />
      <ScrollView
        ref={boardScrollRef}
        bounces={false}
        style={styles.boardScroll}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.boardContent}
        onContentSizeChange={() => syncBoardScrollPosition(false)}
        onLayout={handleBoardLayout}
      >
        <Board width={boardWidth} height={boardHeight}>
          {QUESTION_TILE_INDEXES.map((tileIndex) => (
            <QuestionTrigger
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              key={tileIndex}
              size={questionBadgeSize}
              tileIndex={tileIndex}
            />
          ))}
          {BONUS_CHALLENGE_TILE_INDEXES.map((tileIndex) => (
            <BonusChallengeTrigger
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              key={tileIndex}
              size={questionBadgeSize}
              tileIndex={tileIndex}
            />
          ))}
          <PlayerAvatar
            boardHeight={boardHeight}
            boardWidth={boardWidth}
            characterId={characterId}
            key={sessionToken ?? "pending-session"}
            onTileStep={handleAvatarTileStep}
            size={iconSize}
          />
        </Board>
      </ScrollView>
      <BottomGameConsole />
      <FinishCelebrationModal />
      <QuestionModal />
      <BonusChallengeModal />
      <AnswerFeedbackModal
        correct={!!feedback?.correct}
        onClose={closeFeedback}
        points={feedback?.points ?? 0}
        visible={!!feedback}
      />
      <GameAudioEffects />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
    position: "relative",
  },
  boardScroll: {
    flex: 1,
  },
  boardContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
