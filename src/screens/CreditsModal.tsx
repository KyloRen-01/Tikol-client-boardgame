import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type CreditsModalProps = {
  visible: boolean;
  onClose: () => void;
};

const CREDIT_SECTIONS = [
  {
    title: "Project",
    lines: [
      "TIKOL",
      "Technology-Integrated Knowledge for Observing Learning",
      "Particle Model Board Game",
    ],
  },
  {
    title: "Learning Content",
    lines: [
      "Particle Model of Matter",
      "Question bank, bonus challenges, and phase-recognition activities",
    ],
  },
  {
    title: "Game Systems",
    lines: [
      "Board progression, dice rolling, scoring, character selection, and session history",
    ],
  },
  {
    title: "Built With",
    lines: ["Expo", "React Native", "Zustand", "SQLite and Drizzle"],
  },
  {
    title: "Resource Credits",
    lines: [
      "Dice face icons from Game-icons.net",
      "Dice icon author: Delapouite",
      "Dice icons licensed under Creative Commons Attribution 3.0 Unported",
    ],
  },
  {
    title: "Rights Notice",
    lines: [
      "All third-party images, icons, media, references, names, and other resources remain the property of their rightful owners.",
      "All rights are reserved to the respective owners of these resources.",
      "Resources are used for educational and interactive learning purposes within this project.",
    ],
  },
] as const;

export function CreditsModal({ visible, onClose }: CreditsModalProps) {
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
              <Text style={styles.kicker}>About</Text>
              <Text style={styles.title}>Credits</Text>
            </View>
            <Pressable
              accessibilityLabel="Close credits"
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
            {CREDIT_SECTIONS.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.lines.map((line) => (
                  <Text key={line} style={styles.sectionLine}>
                    {line}
                  </Text>
                ))}
              </View>
            ))}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                No ownership is claimed over third-party resources unless
                explicitly stated.
              </Text>
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
  footer: {
    backgroundColor: "#101625",
    borderRadius: 12,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footerText: {
    color: "#fff5df",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
    textAlign: "center",
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
  section: {
    borderTopColor: "rgba(125, 31, 47, 0.16)",
    borderTopWidth: 1,
    paddingVertical: 14,
  },
  sectionLine: {
    color: "#17213b",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#80652c",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  sheet: {
    backgroundColor: "#fff5df",
    borderColor: "#d9a645",
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: "86%",
    maxWidth: 460,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  title: {
    color: "#101625",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },
});
