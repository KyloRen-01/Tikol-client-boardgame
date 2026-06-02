import { Pressable, Text } from "react-native";
import { buttonStyles } from "../style";

type GameButtonProps = {
  label: string;
  onPress: () => void;
};

export default function GameButton({ label, onPress }: GameButtonProps) {
  return (
    <Pressable style={buttonStyles.button} onPress={onPress}>
      <Text style={buttonStyles.label}>{label}</Text>
    </Pressable>
  );
}
