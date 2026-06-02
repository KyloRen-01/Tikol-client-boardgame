import { StyleSheet } from "react-native";

export const appStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111", // Dark background for the edges
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 8,
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpacing: {
    marginRight: 12,
  },
  counter: {
    backgroundColor: "#222",
    borderRadius: 12,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  counterText: {
    color: "#f4c542",
    fontSize: 16,
    fontWeight: "600",
  },
});

export const buttonStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#f4c542",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  label: {
    color: "#1b1b1b",
    fontSize: 16,
    fontWeight: "600",
  },
});
