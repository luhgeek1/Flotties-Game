import { expect, type Page } from "@playwright/test";

import { getPlayerScoreCard } from "./selectors";

export async function expectQuestionProgress(page: Page, openedCount: number) {
  await expect(page.getByText(`Questions: ${openedCount}/30`)).toBeVisible();
}

export async function expectPlayerScore(page: Page, playerName: string, score: number) {
  const card = getPlayerScoreCard(page, playerName);
  const scoreValue = card.locator("div.text-xl.font-black.font-mono.leading-none.mt-1");
  await expect(scoreValue).toHaveText(String(score));
}
