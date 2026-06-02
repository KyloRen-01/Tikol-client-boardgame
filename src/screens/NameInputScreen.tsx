import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigationStore } from "../store/useNavigationStore";
import { usePlayerStore } from "../store/usePlayerStore";

export function NameInputScreen() {
  const savedName = usePlayerStore((state) => state.player?.name ?? "");
  const setPlayerName = usePlayerStore((state) => state.setPlayerName);
  const goNext = useNavigationStore((state) => state.goNext);
  const [name, setName] = useState(savedName);
  const canContinue = name.trim().length >= 2;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.panel}>
        <Text style={styles.title}>Player Name</Text>
        <TextInput
          autoCapitalize="words"
          maxLength={24}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#8892ad"
          returnKeyType="done"
          style={styles.input}
          value={name}
        />
        <Pressable
          accessibilityRole="button"
          disabled={!canContinue}
          onPress={() => {
            setPlayerName(name);
            goNext();
          }}
          style={[styles.button, !canContinue && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#101625",
  },
  panel: {
    width: "100%",
    maxWidth: 420,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  input: {
    minHeight: 58,
    borderColor: "#355179",
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: "#17213b",
    color: "#ffffff",
    fontSize: 18,
    paddingHorizontal: 18,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ffb12d",
    borderRadius: 14,
    marginTop: 18,
    paddingVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.48,
  },
  buttonText: {
    color: "#17213b",
    fontSize: 18,
    fontWeight: "900",
  },
});
