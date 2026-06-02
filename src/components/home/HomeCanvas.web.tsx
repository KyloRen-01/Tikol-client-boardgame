import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

function WebHomeCanvas() {
  return (
    <View style={styles.container}>
      <View style={styles.orbitRed} />
      <View style={styles.orbitGreen} />
      <View style={styles.panel}>
        <Text style={styles.title}>TIKOL</Text>
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>Teaching Instructional Kit for Observing Learning</Text>
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

export const HomeCanvas = memo(WebHomeCanvas);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#101625",
  },
  orbitRed: {
    position: "absolute",
    left: 32,
    top: 92,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#f36b35",
    opacity: 0.85,
  },
  orbitGreen: {
    position: "absolute",
    right: 44,
    bottom: 142,
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: "#41c978",
    opacity: 0.35,
  },
  panel: {
    width: "100%",
    maxWidth: 430,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#152d6a",
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    color: "#ffb12d",
    fontSize: 62,
    fontWeight: "900",
    lineHeight: 70,
  },
  ribbon: {
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#7a2d2a",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  ribbonText: {
    color: "#fff1c9",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  badge: {
    width: "92%",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#f3f0df",
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 14,
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
    justifyContent: "center",
    width: 224,
    minHeight: 62,
    borderRadius: 18,
    backgroundColor: "#ffb12d",
    marginTop: 18,
  },
  buttonText: {
    color: "#17213b",
    fontSize: 18,
    fontWeight: "900",
  },
});
