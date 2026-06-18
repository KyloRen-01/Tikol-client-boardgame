import { useCallback, useEffect } from "react";
import {
  setAudioModeAsync,
  useAudioPlayer,
  type AudioPlayer,
} from "expo-audio";

const CORRECT_SOUND = require("../../../assets/sounds/correct-bright.wav");
const WRONG_SOUND = require("../../../assets/sounds/wrong-soft.wav");

function replay(player: AudioPlayer) {
  void player
    .seekTo(0)
    .catch(() => undefined)
    .finally(() => {
      player.play();
    });
}

export function useAnswerFeedbackSound() {
  const correctPlayer = useAudioPlayer(CORRECT_SOUND, {
    keepAudioSessionActive: true,
  });
  const wrongPlayer = useAudioPlayer(WRONG_SOUND, {
    keepAudioSessionActive: true,
  });

  useEffect(() => {
    void setAudioModeAsync({
      interruptionMode: "mixWithOthers",
      playsInSilentMode: true,
    }).catch(() => undefined);
  }, []);

  return useCallback(
    (correct: boolean) => {
      replay(correct ? correctPlayer : wrongPlayer);
    },
    [correctPlayer, wrongPlayer],
  );
}
