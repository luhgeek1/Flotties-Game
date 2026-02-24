import { PLAYER_SELECTION_KEY_CODES } from "@/entities/players";
import type { QuestionModalPlayer } from "@/features/question-modal";
import defaultPlayerAvatar from "@/shared/assets/default-user-avatar.svg";
import type { QuestionPackQuestion } from "@/shared/api/questionPack";
import { ONBOARDING_DEMO_QUESTION_ID } from "@/features/onboarding/store/onboardingAtom";

export const DEMO_QUESTION: QuestionPackQuestion = {
  id: ONBOARDING_DEMO_QUESTION_ID,
  value: 100,
  type: "normal",
  question: "Сколько будет 2 + 2?",
  answers: ["4"],
};


export const DEMO_PLAYERS: QuestionModalPlayer[] = [
  {
    id: "onboarding-p1",
    name: "Игрок 1",
    keyCode: PLAYER_SELECTION_KEY_CODES[0],
    avatarUrl: defaultPlayerAvatar,
  },
  {
    id: "onboarding-p2",
    name: "Игрок 2",
    keyCode: PLAYER_SELECTION_KEY_CODES[1],
    avatarUrl: defaultPlayerAvatar,
  },
  {
    id: "onboarding-p3",
    name: "Игрок 3",
    keyCode: PLAYER_SELECTION_KEY_CODES[2],
    avatarUrl: defaultPlayerAvatar,
  },
];
