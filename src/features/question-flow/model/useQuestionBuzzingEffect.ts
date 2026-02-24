import { useEffect } from "react";

import {
  applyPlayerBuzz,
  type QuestionStatePlayer,
  type SetQuestionFlowState,
} from "./questionFlow";

type UseQuestionBuzzingEffectArgs = {
  activeQuestionId: string | null;
  flowPhase: string | null;
  players: QuestionStatePlayer[];
  setQuestionFlowState: SetQuestionFlowState;
};

export function useQuestionBuzzingEffect({
  activeQuestionId,
  flowPhase,
  players,
  setQuestionFlowState,
}: UseQuestionBuzzingEffectArgs) {
  useEffect(() => {
    if (!activeQuestionId || flowPhase !== "reading") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return; // исключает абуз зажатия клавиши

    //определяем какой игрок нажал клавишу
    let buzzPlayer: QuestionStatePlayer | undefined;;
    for (const player of players) {
      if (player.keyCode === event.code) {
        buzzPlayer = player;
        break;
      }
    }  

    if (!buzzPlayer) return;

      event.preventDefault(); // отменяем действие стандартное у кнопки
      setQuestionFlowState(prev => applyPlayerBuzz(prev, activeQuestionId, buzzPlayer.id));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeQuestionId, flowPhase, players, setQuestionFlowState]);
}
