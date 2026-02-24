import { expect, test } from "@playwright/test";

import {
  expectPlayerScore,
  expectQuestionProgress,
  getFirstBoardColumn,
  openApp,
  openFirstQuestion,
  seedDirectRouteState,
  submitAnswer,
  waitForCorrectResultToClose,
} from "./helpers";

test("Сохранение состояния: сыграть вопрос -> reload -> состояние восстановлено", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    adminMode: true,
    scores: { p1: 0, p2: 0, p3: 0 },
    isRoundFirstPickDone: true,
    preserveOnReload: true,
  });
  await openApp(page);

  const firstColumn = getFirstBoardColumn(page);

  await openFirstQuestion(page);
  await submitAnswer(page, { buzzKey: "a", answer: "mvp" });
  await waitForCorrectResultToClose(page);

  await expectQuestionProgress(page, 1);
  await expectPlayerScore(page, "Игрок 1", 100);

  await page.reload();

  await expectQuestionProgress(page, 1);
  await expectPlayerScore(page, "Игрок 1", 100);
  await expect(firstColumn.locator("button")).toHaveCount(4);
});
