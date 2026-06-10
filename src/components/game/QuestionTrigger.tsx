import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import tiles from "../../../lib/store/useTileStore";

type QuestionTriggerProps = {
  tileIndex: number;
  boardWidth: number;
  boardHeight: number;
  size?: number;
};

const FIGMA_WIDTH = 281;
const FIGMA_HEIGHT = 2405;

export const QuestionTrigger = memo(function QuestionTrigger({
  tileIndex,
  boardWidth,
  boardHeight,
  size = 22,
}: QuestionTriggerProps) {
  const position = useMemo(() => {
    const tile =
      tiles[Math.max(0, Math.min(tileIndex, tiles.length - 1))] ?? tiles[0];
    const scaleX = boardWidth / FIGMA_WIDTH;
    const scaleY = boardHeight / FIGMA_HEIGHT;

    return {
      left: tile.x * scaleX - size / 2,
      top: tile.y * scaleY - size / 2,
    };
  }, [boardHeight, boardWidth, size, tileIndex]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[
        styles.marker,
        position,
        {
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      <Text
        style={[styles.mark, { fontSize: size * 0.68, lineHeight: size * 0.8 }]}
      >
        ?
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  marker: {
    alignItems: "center",
    backgroundColor: "#fff4d5",
    borderColor: "#382412",
    borderWidth: 2,
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
  },
  mark: {
    color: "#221406",
    fontWeight: "900",
    includeFontPadding: false,
    textAlign: "center",
  },
});
