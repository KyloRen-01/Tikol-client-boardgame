import { memo, useCallback, useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useGameStore } from "../../store/gameStore";
import { useAnswerFeedbackSound } from "./useAnswerFeedbackSound";

export const BonusChallengeModal = memo(function BonusChallengeModal() {
  const activeBonusChallenge = useGameStore(
    (state) => state.activeBonusChallenge,
  );
  const isBonusChallengeModalVisible = useGameStore(
    (state) => state.isBonusChallengeModalVisible,
  );
  const closeBonusChallengeModal = useGameStore(
    (state) => state.closeBonusChallengeModal,
  );
  const resolveBonusChallengeAnswer = useGameStore(
    (state) => state.resolveBonusChallengeAnswer,
  );
  const playAnswerFeedbackSound = useAnswerFeedbackSound();
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (isBonusChallengeModalVisible) {
      setSelectedAnswerIndex(null);
    }
  }, [activeBonusChallenge?.id, isBonusChallengeModalVisible]);

  const handleLockIn = useCallback(() => {
    if (selectedAnswerIndex === null || !activeBonusChallenge) {
      return;
    }

    playAnswerFeedbackSound(
      selectedAnswerIndex === activeBonusChallenge.correctAnswerIndex,
    );
    resolveBonusChallengeAnswer(selectedAnswerIndex);
  }, [
    activeBonusChallenge,
    playAnswerFeedbackSound,
    resolveBonusChallengeAnswer,
    selectedAnswerIndex,
  ]);

  if (!activeBonusChallenge) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeBonusChallengeModal}
      statusBarTranslucent
      transparent
      visible={isBonusChallengeModalVisible}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.questionNumber}>
            Bonus Challenge: {activeBonusChallenge.correctAnswerPoints} Points
          </Text>
          <Text style={styles.questionText}>{activeBonusChallenge.prompt}</Text>

          <Image
            accessibilityLabel={`${activeBonusChallenge.title} challenge image`}
            resizeMode="cover"
            source={activeBonusChallenge.image}
            style={styles.challengeImage}
          />

          <View style={styles.choiceList}>
            {activeBonusChallenge.choices.map((choice, index) => {
              const isSelected = selectedAnswerIndex === index;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  key={`${activeBonusChallenge.id}-${choice}`}
                  onPress={() => setSelectedAnswerIndex(index)}
                  style={({ pressed }) => [
                    styles.choice,
                    isSelected ? styles.choiceSelected : null,
                    pressed ? styles.choicePressed : null,
                  ]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected ? styles.radioOuterSelected : null,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <Text
                    style={[
                      styles.choiceText,
                      isSelected ? styles.choiceTextSelected : null,
                    ]}
                  >
                    {choice}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={selectedAnswerIndex === null}
            onPress={handleLockIn}
            style={({ pressed }) => [
              styles.lockButton,
              selectedAnswerIndex === null ? styles.lockButtonDisabled : null,
              pressed && selectedAnswerIndex !== null
                ? styles.lockButtonPressed
                : null,
            ]}
          >
            <Text style={styles.lockButtonText}>Lock In</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(17, 17, 17, 0.78)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff7df",
    borderColor: "#382412",
    borderRadius: 18,
    borderWidth: 3,
    maxWidth: 420,
    padding: 20,
    width: "100%",
  },
  challengeImage: {
    backgroundColor: "#ffffff",
    borderColor: "#f3c34d",
    borderRadius: 12,
    borderWidth: 2,
    height: 170,
    marginBottom: 16,
    width: "100%",
  },
  questionNumber: {
    color: "#0f6b4c",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  questionText: {
    color: "#221406",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 27,
    marginBottom: 14,
  },
  choiceList: {
    gap: 10,
    marginBottom: 18,
  },
  choice: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#f3c34d",
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  choicePressed: {
    opacity: 0.82,
  },
  choiceSelected: {
    backgroundColor: "#d7fff0",
    borderColor: "#0f6b4c",
  },
  choiceText: {
    color: "#382412",
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
  },
  choiceTextSelected: {
    color: "#221406",
  },
  lockButton: {
    alignItems: "center",
    backgroundColor: "#2f8f46",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
  },
  lockButtonDisabled: {
    backgroundColor: "#8f8779",
  },
  lockButtonPressed: {
    opacity: 0.84,
  },
  lockButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900",
  },
  radioInner: {
    backgroundColor: "#0f6b4c",
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  radioOuter: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d6a127",
    borderRadius: 11,
    borderWidth: 2,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  radioOuterSelected: {
    borderColor: "#0f6b4c",
  },
});
