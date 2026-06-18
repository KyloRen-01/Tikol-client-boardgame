import type { ImageSourcePropType } from "react-native";

export type BonusChallenge = {
  id: number;
  title: string;
  prompt: string;
  image: ImageSourcePropType;
  choices: [string, string, string, string];
  correctAnswerIndex: number;
  correctAnswerPoints: number;
};

export const BONUS_CHALLENGES_BY_TILE_INDEX: Record<number, BonusChallenge> = {
  5: {
    id: 101,
    title: "Milk",
    prompt: "Which phase of matter is the main object in the image?",
    image: require("../../assets/milk.png"),
    choices: ["Solid", "Liquid", "Gas", "Solid and Gas"],
    correctAnswerIndex: 1,
    correctAnswerPoints: 5,
  },
  14: {
    id: 102,
    title: "Wood",
    prompt: "Which phase of matter is the main object in the image?",
    image: require("../../assets/wood.png"),
    choices: ["Gas", "Liquid", "Solid", "Liquid and Gas"],
    correctAnswerIndex: 2,
    correctAnswerPoints: 5,
  },
  29: {
    id: 103,
    title: "Sky",
    prompt: "Which phases of matter are shown by the air and clouds?",
    image: require("../../assets/sky.png"),
    choices: ["Solid only", "Liquid only", "Gas only", "Liquid and Gas"],
    correctAnswerIndex: 3,
    correctAnswerPoints: 5,
  },
  41: {
    id: 104,
    title: "Tea",
    prompt: "Which phases of matter are shown by the tea, leaves, and steam?",
    image: require("../../assets/tea.png"),
    choices: ["Solid and Liquid", "Liquid and Gas", "Solid, Liquid, and Gas", "Gas only"],
    correctAnswerIndex: 2,
    correctAnswerPoints: 5,
  },
  55: {
    id: 105,
    title: "Balloon",
    prompt: "Which phases of matter make up the balloon and the air inside it?",
    image: require("../../assets/balloon.png"),
    choices: ["Solid and Gas", "Liquid and Gas", "Solid only", "Gas only"],
    correctAnswerIndex: 0,
    correctAnswerPoints: 5,
  },
  63: {
    id: 106,
    title: "Water",
    prompt: "Which phase of matter is the main object in the image?",
    image: require("../../assets/water.png"),
    choices: ["Solid", "Liquid", "Gas", "Solid and Liquid"],
    correctAnswerIndex: 1,
    correctAnswerPoints: 5,
  },
  68: {
    id: 107,
    title: "Wind Tunnel",
    prompt: "Which phase of matter is moving through the tunnel?",
    image: require("../../assets/windtunnel.png"),
    choices: ["Solid", "Liquid", "Gas", "Solid and Liquid"],
    correctAnswerIndex: 2,
    correctAnswerPoints: 5,
  },
  77: {
    id: 108,
    title: "Book",
    prompt: "Which phase of matter is the main object in the image?",
    image: require("../../assets/book.png"),
    choices: ["Solid", "Liquid", "Gas", "Liquid and Gas"],
    correctAnswerIndex: 0,
    correctAnswerPoints: 5,
  },
  86: {
    id: 109,
    title: "Chair",
    prompt: "Which phase of matter is the main object in the image?",
    image: require("../../assets/chair.png"),
    choices: ["Gas", "Solid", "Liquid", "Solid and Gas"],
    correctAnswerIndex: 1,
    correctAnswerPoints: 5,
  },
  98: {
    id: 110,
    title: "Car",
    prompt: "Which phases of matter can be found in a working car?",
    image: require("../../assets/car.png"),
    choices: ["Solid only", "Solid and Liquid", "Solid and Gas", "Solid, Liquid, and Gas"],
    correctAnswerIndex: 3,
    correctAnswerPoints: 5,
  },
};
