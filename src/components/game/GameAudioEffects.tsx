import { useEffect, useRef } from "react";
import {
  setAudioModeAsync,
  useAudioPlayer,
  type AudioPlayer,
} from "expo-audio";
import { useGameStore } from "../../store/gameStore";

const FINISH_SOUND = require("../../../assets/sounds/finish-fanfare.wav");

function replay(player: AudioPlayer) {
  void player
    .seekTo(0)
    .catch(() => undefined)
    .finally(() => {
      player.play();
    });
}

export function GameAudioEffects() {
  const isGameFinished = useGameStore((state) => state.isGameFinished);
  const finishPlayer = useAudioPlayer(FINISH_SOUND, {
    keepAudioSessionActive: true,
  });
  const didPlayFinishRef = useRef(false);

  useEffect(() => {
    void setAudioModeAsync({
      interruptionMode: "mixWithOthers",
      playsInSilentMode: true,
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!isGameFinished) {
      didPlayFinishRef.current = false;
      return;
    }

    if (didPlayFinishRef.current) {
      return;
    }

    didPlayFinishRef.current = true;
    replay(finishPlayer);
  }, [finishPlayer, isGameFinished]);

  return null;
}
