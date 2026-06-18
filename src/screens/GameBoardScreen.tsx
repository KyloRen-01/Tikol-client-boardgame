import { useCallback, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Board from "../../components/Board";
import { AnswerFeedbackModal } from "../components/game/AnswerFeedbackModal";
import { BottomGameConsole } from "../components/game/BottomGameConsole";
import { BonusChallengeModal } from "../components/game/BonusChallengeModal";
import { BonusChallengeTrigger } from "../components/game/BonusChallengeTrigger";
import { GameAudioEffects } from "../components/game/GameAudioEffects";
import { GameTopBar } from "../components/game/GameTopBar";
import { PlayerAvatar } from "../components/game/PlayerAvatar";
import { QuestionModal } from "../components/game/QuestionModal";
import { QuestionTrigger } from "../components/game/QuestionTrigger";
import {
  BONUS_CHALLENGE_TILE_INDEXES,
  QUESTION_TILE_INDEXES,
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

export function GameBoardScreen() {
  const boardScrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = useWindowDimensions();
  const session = usePlayerStore((state) => state.currentSession);
  const player = usePlayerStore((state) => state.player);
  const sessionToken = useGameStore((state) => state.sessionToken);
  const initializeSession = useGameStore((state) => state.initializeSession);
  const feedback = useGameStore((state) => state.feedback);
  const closeFeedback = useGameStore((state) => state.closeFeedback);
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

  const scrollToBoardBottom = useCallback(() => {
    requestAnimationFrame(() => {
      boardScrollRef.current?.scrollToEnd({ animated: false });
    });
  }, []);

  return (
    <View style={styles.root}>
      <GameTopBar />
      <ScrollView
        ref={boardScrollRef}
        bounces={false}
        style={styles.boardScroll}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.boardContent}
        onContentSizeChange={scrollToBoardBottom}
        onLayout={scrollToBoardBottom}
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
            size={iconSize}
          />
        </Board>
      </ScrollView>
      <BottomGameConsole />
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
  },
  boardScroll: {
    flex: 1,
  },
  boardContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
