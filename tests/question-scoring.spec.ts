import { expect, test } from "@playwright/test";

import {
  expectPlayerScore,
  getPlayerScoreCard,
  openApp,
  openFirstQuestion,
  seedDirectRouteState,
  submitAnswer,
  waitForCorrectResultToClose,
} from "./helpers";

test("Обычный вопрос: неверный ответ -> второй отвечает верно -> смена права выбора", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    adminMode: true,
    scores: { p1: 0, p2: 0, p3: 0 },
    isRoundFirstPickDone: true,
  });
  await openApp(page);

  await openFirstQuestion(page);

  await submitAnswer(page, { buzzKey: "a", answer: "ошибка" });
  await expect(page.getByText("Неверно")).toBeVisible();
  await page.getByRole("button", { name: "Продолжить" }).click();

  await submitAnswer(page, { buzzKey: "Space", answer: "mvp" });
  await waitForCorrectResultToClose(page);

  await expectPlayerScore(page, "Игрок 1", -100);
  await expectPlayerScore(page, "Игрок 2", 100);
  await expect(getPlayerScoreCard(page, "Игрок 2")).toHaveClass(/border-primary/);
});
