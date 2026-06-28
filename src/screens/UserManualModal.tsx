import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type UserManualModalProps = {
  visible: boolean;
  onClose: () => void;
};

const GAME_FLOW_STEPS = [
  "Open the TIKOL app",
  "Select Start Game",
  "Enter player name",
  "Choose a character",
  "Roll the dice",
  "Move across tiles",
  "Answer questions on question-mark tiles and on bonus question tiles",
  "Earn points for correct answers",
  "Progress through Solid, Liquid, and Gas Zones",
  "Reach Tile 100 and view final score",
] as const;

export function UserManualModal({ visible, onClose }: UserManualModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>User Manual</Text>
              <Text style={styles.title}>Game Flow</Text>
            </View>
            <Pressable
              accessibilityLabel="Close user manual"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Summary of Game Flow</Text>
            <View style={styles.stepList}>
              {GAME_FLOW_STEPS.map((step, index) => (
                <View key={step} style={styles.stepRow}>
                  <Text style={styles.stepNumber}>{index + 1}.</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(16, 22, 37, 0.9)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#7d1f2f",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  closeText: {
    color: "#fff5df",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  content: {
    paddingBottom: 4,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  kicker: {
    color: "#7d1f2f",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  pressed: {
    opacity: 0.82,
  },
  sectionTitle: {
    color: "#0b4f83",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
  },
  sheet: {
    backgroundColor: "#fff5df",
    borderColor: "#d9a645",
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: "84%",
    maxWidth: 460,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  stepList: {
    gap: 12,
    marginTop: 14,
  },
  stepNumber: {
    color: "#101625",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    width: 28,
  },
  stepRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  stepText: {
    color: "#101625",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  title: {
    color: "#101625",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },
});
