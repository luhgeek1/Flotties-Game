import { expect, test } from "@playwright/test";

import { openApp, seedDirectRouteState } from "./helpers";

async function completeBidTurn(page: import("@playwright/test").Page, bid: string) {
  await page.getByRole("button", { name: "Я готов" }).click();
  await expect(page.getByText("Сделайте вашу ставку")).toBeVisible();

  await page.locator('input[type="number"]').fill(bid);
  await page.getByRole("button", { name: "Подтвердить ставку" }).click();
}

async function completeAnswerTurn(page: import("@playwright/test").Page, answer: string) {
  await page.getByRole("button", { name: "Я готов" }).click();
  await expect(page.getByText("Какой роман начинается знаменитой фразой")).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();

  await page.getByPlaceholder("Введите ответ...").fill(answer);
  await page.getByRole("button", { name: "Ответить" }).click();
}

test("Финал: положительные игроки -> скрытые ставки -> вопрос -> результаты", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "finalprepairing",
    isRound2Unlocked: true,
    scores: { p1: 400, p2: 300, p3: -50 },
    isRoundFirstPickDone: true,
  });

  await openApp(page);

  await expect(page.getByText("Подготовка к финалу")).toBeVisible();
  await page.getByRole("button", { name: "Готовы" }).click();
  await page.getByRole("button", { name: "Перейти к ставкам" }).click();

  await completeBidTurn(page, "100");
  await completeBidTurn(page, "50");

  await expect(page.getByText("Ставки приняты")).toBeVisible();
  await expect(page.getByText("Секретные ответы")).toBeVisible({ timeout: 10_000 });

  await completeAnswerTurn(page, "Анна Каренина");
  await completeAnswerTurn(page, "неверный");

  await expect(page.getByText("Ответы приняты")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Финальные результаты" })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Победитель")).toBeVisible();
});
