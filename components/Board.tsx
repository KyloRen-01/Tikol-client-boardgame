import type { ReactNode } from "react";
import { View } from "react-native";
import GameBoardFrame from "../assets/game-background/OfficialGameBoardFrame.svg";

type BoardProps = {
  width: number;
  height: number;
  children?: ReactNode;
};

export default function Board({ width, height, children }: BoardProps) {
  return (
    <View style={{ width, height }}>
      <GameBoardFrame width={width} height={height} />
      <View style={{ position: "absolute", left: 0, top: 0, width, height }}>
        {children}
      </View>
    </View>
  );
}
