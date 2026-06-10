import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { CharacterIcon } from "../components/character/CharacterIcon";
import { CHARACTER_OPTIONS } from "../constants/characters";
import { useGameStore } from "../store/gameStore";
import { useNavigationStore } from "../store/useNavigationStore";
import { usePlayerStore } from "../store/usePlayerStore";

export function CharacterSelectionScreen() {
  const selectedCharacter = usePlayerStore(
    (state) => state.player?.selectedCharacter,
  );
  const pendingCharacter = usePlayerStore((state) => state.pendingCharacter);
  const requestCharacterConfirmation = usePlayerStore(
    (state) => state.requestCharacterConfirmation,
  );
  const cancelCharacterConfirmation = usePlayerStore(
    (state) => state.cancelCharacterConfirmation,
  );
  const confirmCharacter = usePlayerStore((state) => state.confirmCharacter);
  const startSession = usePlayerStore((state) => state.startSession);
  const initializeSession = useGameStore((state) => state.initializeSession);
  const goNext = useNavigationStore((state) => state.goNext);
  const pendingCharacterOption = CHARACTER_OPTIONS.find(
    (character) => character.id === pendingCharacter,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Matter State</Text>
      <View style={styles.grid}>
        {CHARACTER_OPTIONS.map((character) => {
          const selected = selectedCharacter === character.id;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={character.id}
              onPress={() => requestCharacterConfirmation(character.id)}
              style={[
                styles.card,
                {
                  borderColor: selected ? character.color : "#2b3f61",
                  shadowColor: character.color,
                },
              ]}
            >
              <CharacterIcon characterId={character.id} size={58} />
              <Text style={[styles.cardTitle, { color: character.color }]}>
                {character.name}
              </Text>
              <Text style={styles.cardSubtitle}>{character.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>
      <Modal
        animationType="fade"
        onRequestClose={cancelCharacterConfirmation}
        transparent
        visible={!!pendingCharacterOption}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialog}>
            {pendingCharacterOption ? (
              <>
                <CharacterIcon characterId={pendingCharacterOption.id} size={72} />
                <Text style={styles.dialogTitle}>Confirm Character</Text>
                <Text style={styles.dialogText}>
                  Choose {pendingCharacterOption.name} as your character?
                </Text>
                <View style={styles.dialogActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={cancelCharacterConfirmation}
                    style={[styles.dialogButton, styles.cancelButton]}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={async () => {
                      const character = confirmCharacter();
                      if (character) {
                        startSession();
                        await initializeSession();
                        goNext();
                      }
                    }}
                    style={[
                      styles.dialogButton,
                      styles.confirmButton,
                      { backgroundColor: pendingCharacterOption.color },
                    ]}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 72,
    backgroundColor: "#101625",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  card: {
    alignItems: "center",
    width: "47%",
    maxWidth: 160,
    minHeight: 142,
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "#17213b",
    paddingHorizontal: 10,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  cardSubtitle: {
    color: "#d8e2ff",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(5, 10, 20, 0.72)",
    padding: 22,
  },
  dialog: {
    width: "100%",
    maxWidth: 330,
    alignItems: "center",
    borderColor: "#33476f",
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "#17213b",
    padding: 22,
  },
  dialogTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 12,
  },
  dialogText: {
    color: "#d8e2ff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  dialogActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  dialogButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 13,
  },
  cancelButton: {
    backgroundColor: "#263451",
  },
  confirmButton: {
    backgroundColor: "#ffb12d",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  confirmButtonText: {
    color: "#101625",
    fontSize: 15,
    fontWeight: "900",
  },
});
