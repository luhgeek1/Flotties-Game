import { expect, type Page } from "@playwright/test";

import { getFirstBoardColumn } from "./selectors";

export async function openApp(page: Page) {
  await page.goto("/#/");
}

export async function startGameFromSetup(page: Page) {
  await expect(page.getByText("Выберите игроков")).toBeVisible();

  await page.getByText("Игрок 1").first().click();
  await page.getByText("Игрок 2").first().click();
  await page.getByText("Игрок 3").first().click();
  await page.getByRole("button", { name: /Продолжить 3\/3/ }).click();

  await expect(page.getByText("Выберите пак вопросов")).toBeVisible();
  await page.getByRole("button", { name: /Default Pack/ }).click();
  await page.getByRole("button", { name: /Начать игру/ }).click();

  await expect(page.getByText("Questions: 0/30")).toBeVisible();
}

export async function openFirstQuestion(page: Page) {
  const firstColumn = getFirstBoardColumn(page);
  const normalQuestionButton = firstColumn
    .locator("button:not(.border-red-500):not(.border-violet-500)")
    .first();

  await normalQuestionButton.click();
  await expect(page.getByText("Нажмите вашу клавишу, чтобы ответить!")).toBeVisible();
}

type SubmitAnswerOptions = {
  buzzKey: "a" | "Space" | "l";
  answer?: string;
};

export async function submitAnswer(page: Page, options: SubmitAnswerOptions) {
  await page.keyboard.press(options.buzzKey);
  const answerInput = page.getByPlaceholder("Введите ответ...");
  await expect(answerInput).toBeVisible();

  if (options.answer !== undefined) {
    await answerInput.fill(options.answer);
  }

  await page.getByRole("button", { name: "Ответить" }).click();
}

export async function waitForCorrectResultToClose(page: Page) {
  await expect(page.getByText("Верно!")).toBeVisible();
  await expect(page.getByText("Верно!")).toBeHidden({ timeout: 6_000 });
}
