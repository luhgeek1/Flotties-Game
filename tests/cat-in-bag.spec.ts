import { expect, test } from "@playwright/test";

import {
  expectPlayerScore,
  expectQuestionProgress,
  openApp,
  seedDirectRouteState,
  waitForCorrectResultToClose,
} from "./helpers";

test("Кот в мешке: выбрать игрока -> ставка -> ответ -> счет по ставке", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    adminMode: true,
    scores: { p1: 1000, p2: 1000, p3: 1000 },
    isRoundFirstPickDone: true,
  });

  await openApp(page);

  const catButton = page.locator("button.border-red-500").first();
  await expect(catButton).toBeVisible();
  await catButton.click();

  await page.mouse.click(4, 4);
  await expect(page.getByText("Кот в мешке")).toBeVisible({ timeout: 7_000 });

  await page.getByRole("button", { name: /Игрок 2/ }).click();
  await expect(page.getByText("Выберите ставку")).toBeVisible();
  await page.getByRole("button", { name: /^100$/ }).last().click();
  await page.getByRole("button", { name: "Ответить" }).click();

  await waitForCorrectResultToClose(page);
  await expectQuestionProgress(page, 1);
  await expectPlayerScore(page, "Игрок 2", 1100);
});
