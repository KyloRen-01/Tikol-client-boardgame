import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

function NativeHomeCanvas() {
  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>TIKOL</Text>
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>
            Technology-Integrated Knowledge for Observing Learning
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Particle Model Board Game</Text>
        </View>
      </View>
      <Text style={styles.caption}>The Particle Model of Matter</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>START</Text>
      </View>
    </View>
  );
}

export const HomeCanvas = memo(NativeHomeCanvas);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#101625",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  panel: {
    alignItems: "center",
    backgroundColor: "#152d6a",
    borderRadius: 24,
    maxWidth: 430,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    width: "100%",
  },
  title: {
    color: "#ffb12d",
    fontSize: 62,
    fontWeight: "900",
    lineHeight: 70,
  },
  ribbon: {
    alignItems: "center",
    backgroundColor: "#7a2d2a",
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: "100%",
  },
  ribbonText: {
    color: "#fff1c9",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#f3f0df",
    borderRadius: 18,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: "92%",
  },
  badgeText: {
    color: "#14224c",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  caption: {
    color: "#e8fff5",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 28,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 18,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 62,
    width: 224,
  },
  buttonText: {
    color: "#17213b",
    fontSize: 18,
    fontWeight: "900",
  },
});
