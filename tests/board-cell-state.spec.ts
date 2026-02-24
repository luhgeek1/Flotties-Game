import { expect, test } from "@playwright/test";

import {
  expectQuestionProgress,
  getFirstBoardColumn,
  openApp,
  openFirstQuestion,
  seedDirectRouteState,
  submitAnswer,
  waitForCorrectResultToClose,
} from "./helpers";

test("Табло: выбор ячейки -> вопрос -> возврат -> ячейка исчезла", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    adminMode: true,
    scores: { p1: 0, p2: 0, p3: 0 },
    isRoundFirstPickDone: true,
  });
  await openApp(page);

  const firstColumn = getFirstBoardColumn(page);
  await expect(firstColumn.locator("button")).toHaveCount(5);

  await openFirstQuestion(page);
  await submitAnswer(page, { buzzKey: "a", answer: "mvp" });
  await waitForCorrectResultToClose(page);

  await expectQuestionProgress(page, 1);
  await expect(firstColumn.locator("button")).toHaveCount(4);
});
