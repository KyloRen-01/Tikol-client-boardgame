import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useScoreStore } from "../../store/scoreStore";
import { Dice } from "./Dice";

const DICE_BUTTON_SIZE = 98;
const CONSOLE_GAP = 10;
const OUTER_HORIZONTAL_PADDING = 14;
const MIN_INFO_CARD_WIDTH = 82;
const MAX_INFO_CARD_WIDTH = 132;

export function BottomGameConsole() {
  const { width } = useWindowDimensions();
  const playerName = usePlayerStore((state) => state.player?.name ?? "Player");
  const score = useScoreStore((state) => state.score);
  const availableInfoCardWidth =
    (width -
      OUTER_HORIZONTAL_PADDING * 2 -
      DICE_BUTTON_SIZE -
      CONSOLE_GAP * 2) /
    2;
  const infoCardWidth = Math.max(
    MIN_INFO_CARD_WIDTH,
    Math.min(MAX_INFO_CARD_WIDTH, availableInfoCardWidth),
  );

  return (
    <View style={styles.outer}>
      <View style={styles.console}>
        <View
          pointerEvents="none"
          style={[styles.balanceSlot, { width: infoCardWidth }]}
        />
        <View style={styles.diceWrap}>
          <Dice />
        </View>
        <View style={[styles.infoCard, { width: infoCardWidth }]}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.playerName}
          >
            {playerName}
          </Text>
          <View style={styles.pointsRow}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.pointsValue}
            >
              {score}
            </Text>
            <Text style={styles.pointsLabel}>POINTS</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    backgroundColor: "transparent",
    minHeight: 124,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 10,
    zIndex: 4,
  },
  console: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    maxWidth: 720,
    width: "100%",
  },
  balanceSlot: {
    flexGrow: 0,
    flexShrink: 0,
  },
  playerName: {
    color: "#101625",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 16,
    maxWidth: "100%",
  },
  diceWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 14,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: "center",
    minHeight: 70,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pointsRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    marginTop: 3,
  },
  pointsValue: {
    color: "#101625",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 25,
  },
  pointsLabel: {
    color: "#452907",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
  },
});
