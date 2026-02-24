import { expect, test } from "@playwright/test";

import {
  expectPlayerScore,
  expectQuestionProgress,
  openApp,
  seedDirectRouteState,
  waitForCorrectResultToClose,
} from "./helpers";

test("Аукцион: ва-банк + ограничения -> победитель отвечает", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    adminMode: true,
    scores: { p1: 1000, p2: 600, p3: 150 },
    isRoundFirstPickDone: true,
  });

  await openApp(page);

  const auctionButton = page.locator("button.border-violet-500").first();
  await expect(auctionButton).toBeVisible();
  await auctionButton.click();

  await page.mouse.click(4, 4);
  await expect(page.getByRole("heading", { name: /Ограниченный аукцион/i })).toBeVisible();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByText("ВОПРОС-АУКЦИОН")).toBeVisible({ timeout: 7_000 });

  await page.getByRole("button", { name: /Ва-банк \(1000\)/ }).click();
  await expect(page.getByText("Ставка невозможна")).toBeVisible();
  await page.getByRole("button", { name: "Пас" }).click();

  await page.getByRole("button", { name: "Ответить" }).click();
  await waitForCorrectResultToClose(page);

  await expectQuestionProgress(page, 1);
  await expectPlayerScore(page, "Игрок 1", 2000);
});
