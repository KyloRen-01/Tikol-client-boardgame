import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  matchFont,
  RoundedRect,
  Shadow,
  Text as SkiaText,
  vec,
} from "@shopify/react-native-skia";
import { memo, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

const TITLE_LINES = [
  "TIKOL",
  "Particle Model Board Game",
  "Teaching Instructional Kit for Observing Learning",
  "The Particle Model of Matter",
];

function NativeHomeCanvas() {
  const { width, height } = useWindowDimensions();
  const canvasWidth = Math.max(width, 320);
  const canvasHeight = Math.max(height, 620);
  const centerX = canvasWidth / 2;

  const fonts = useMemo(
    () => ({
      title: matchFont({ fontFamily: "Arial", fontSize: 58, fontWeight: "900" }),
      subtitle: matchFont({ fontFamily: "Arial", fontSize: 22, fontWeight: "800" }),
      body: matchFont({ fontFamily: "Arial", fontSize: 14, fontWeight: "700" }),
      button: matchFont({ fontFamily: "Arial", fontSize: 18, fontWeight: "900" }),
    }),
    [],
  );

  const boardWidth = Math.min(canvasWidth - 32, 430);
  const titleY = Math.max(canvasHeight * 0.2, 128);
  const buttonY = Math.min(canvasHeight - 172, titleY + 270);

  return (
    <Canvas style={styles.canvas}>
      <RoundedRect x={0} y={0} width={canvasWidth} height={canvasHeight} r={0}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(canvasWidth, canvasHeight)}
          colors={["#0e1424", "#14375d", "#1e7a72"]}
        />
      </RoundedRect>
      <Circle cx={centerX - 145} cy={titleY - 86} r={54} color="#f36b35" opacity={0.88}>
        <Shadow dx={0} dy={10} blur={18} color="rgba(0,0,0,0.28)" />
      </Circle>
      <Circle cx={centerX + 150} cy={titleY - 70} r={38} color="#61d37b" opacity={0.86} />
      <Circle cx={centerX + 110} cy={titleY + 205} r={74} color="#1d9af2" opacity={0.28} />
      <Group>
        <RoundedRect
          x={(canvasWidth - boardWidth) / 2}
          y={titleY - 78}
          width={boardWidth}
          height={252}
          r={24}
          color="#102553"
        >
          <Shadow dx={0} dy={12} blur={20} color="rgba(0,0,0,0.35)" />
        </RoundedRect>
        <RoundedRect
          x={(canvasWidth - boardWidth) / 2 + 10}
          y={titleY - 66}
          width={boardWidth - 20}
          height={228}
          r={18}
          color="#152d6a"
        />
        <RoundedRect
          x={(canvasWidth - boardWidth) / 2 + 26}
          y={titleY + 56}
          width={boardWidth - 52}
          height={48}
          r={10}
          color="#7a2d2a"
        />
        <RoundedRect
          x={(canvasWidth - boardWidth) / 2 + 46}
          y={titleY + 118}
          width={boardWidth - 92}
          height={58}
          r={18}
          color="#f3f0df"
        />
        <SkiaText x={centerX - 96} y={titleY + 16} text={TITLE_LINES[0]} font={fonts.title} color="#ffb12d" />
        <SkiaText x={centerX - 146} y={titleY + 91} text={TITLE_LINES[2]} font={fonts.body} color="#fff1c9" />
        <SkiaText x={centerX - 136} y={titleY + 153} text={TITLE_LINES[1]} font={fonts.subtitle} color="#14224c" />
      </Group>
      <SkiaText x={centerX - 122} y={buttonY - 34} text={TITLE_LINES[3]} font={fonts.body} color="#e8fff5" />
      <RoundedRect x={centerX - 112} y={buttonY} width={224} height={62} r={18} color="#ffb12d">
        <Shadow dx={0} dy={8} blur={14} color="rgba(0,0,0,0.25)" />
      </RoundedRect>
      <SkiaText x={centerX - 48} y={buttonY + 39} text="START" font={fonts.button} color="#17213b" />
    </Canvas>
  );
}

export const HomeCanvas = memo(NativeHomeCanvas);

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
