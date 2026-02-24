import { expect, test } from "@playwright/test";

import {
  expectQuestionProgress,
  getPlayerScoreCard,
  openApp,
  openFirstQuestion,
  seedDirectRouteState,
  submitAnswer,
  waitForCorrectResultToClose,
} from "./helpers";

const PREOPENED_IDS = Array.from({ length: 29 }, (_, index) => `opened-${index}`);

test("Переход раундов: конец 1-го -> экран результатов -> старт 2-го -> выбор у минимального счета", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    adminMode: true,
    scores: { p1: 300, p2: 200, p3: -200 },
    openedQuestionIds: PREOPENED_IDS,
    isRoundFirstPickDone: true,
  });

  await openApp(page);
  await expectQuestionProgress(page, 29);

  await openFirstQuestion(page);
  await submitAnswer(page, { buzzKey: "a" });
  await waitForCorrectResultToClose(page);

  await expect(page.getByText("Итоги Раунда")).toBeVisible();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await page.getByRole("button", { name: /2 раунд/ }).click();

  await expect(page).toHaveURL(/#\/game2r/);
  await expectQuestionProgress(page, 0);
  await expect(getPlayerScoreCard(page, "Игрок 3")).toHaveClass(/border-primary/);
});
