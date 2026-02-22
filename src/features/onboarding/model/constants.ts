import type { GameBoardTheme } from "@/entities/game-board/model";
import { PLAYER_SELECTION_KEY_CODES } from "@/entities/players";
import type { QuestionModalPlayer } from "@/features/question-modal";
import defaultPlayerAvatar from "@/shared/assets/default-user-avatar.svg";
import type { QuestionPackQuestion } from "@/shared/api/questionPack";
import { ONBOARDING_DEMO_QUESTION_ID } from "@/shared/store/onboardingAtom";

export const DEMO_QUESTION: QuestionPackQuestion = {
  id: ONBOARDING_DEMO_QUESTION_ID,
  value: 100,
  type: "normal",
  question: "Какой язык программирования создал Гвидо ван Россум?",
  answers: ["python"],
};

export const DEMO_THEME: GameBoardTheme = {
  id: "r1-langs",
  title: "Языки программирования",
  questions: [{ id: ONBOARDING_DEMO_QUESTION_ID, value: 100 }],
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
