import { Pressable, StyleSheet, Text, View } from "react-native";
import { CharacterIcon } from "../components/character/CharacterIcon";
import { CHARACTER_OPTIONS } from "../constants/characters";
import { useNavigationStore } from "../store/useNavigationStore";
import { usePlayerStore } from "../store/usePlayerStore";

export function CharacterSelectionScreen() {
  const selectedCharacter = usePlayerStore(
    (state) => state.player?.selectedCharacter,
  );
  const selectCharacter = usePlayerStore((state) => state.selectCharacter);
  const startSession = usePlayerStore((state) => state.startSession);
  const goNext = useNavigationStore((state) => state.goNext);

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
              onPress={() => {
                selectCharacter(character.id);
                startSession();
                goNext();
              }}
              style={[
                styles.card,
                { borderColor: selected ? character.color : "#2b3f61" },
              ]}
            >
              <CharacterIcon characterId={character.id} size={76} />
              <Text style={[styles.cardTitle, { color: character.color }]}>
                {character.name}
              </Text>
              <Text style={styles.cardSubtitle}>{character.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#101625",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 24,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",

    alignItems: "center",
    gap: 16,
  },
  card: {
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
    minHeight: 150,
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: "#17213b",
    padding: 18,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },
  cardSubtitle: {
    color: "#d8e2ff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },
});
