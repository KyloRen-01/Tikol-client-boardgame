import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  correct: boolean;
  points: number;
  onClose: () => void;
};

export function AnswerFeedbackModal({ visible, correct, points, onClose }: Props) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{correct ? "Correct!" : "Better luck next time"}</Text>
          {correct ? <Text style={styles.points}>+{points} points</Text> : null}
          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(17,17,17,0.78)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff7df",
    borderColor: "#382412",
    borderRadius: 16,
    borderWidth: 3,
    maxWidth: 340,
    padding: 22,
    width: "100%",
  },
  title: { color: "#221406", fontSize: 24, fontWeight: "900", textAlign: "center" },
  points: { color: "#2f8f46", fontSize: 18, fontWeight: "900", marginTop: 8 },
  button: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 10,
    marginTop: 18,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  buttonText: { color: "#221406", fontSize: 16, fontWeight: "900" },
});
