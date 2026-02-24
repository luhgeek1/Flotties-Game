import type { Locator, Page } from "@playwright/test";

export function getFirstBoardColumn(page: Page): Locator {
  return page.locator("main div.flex.flex-col.gap-3.h-full").first();
}

export function getPlayerScoreCard(page: Page, playerName: string): Locator {
  return page
    .locator("aside div.flex.items-center.gap-4.p-3.rounded-xl.border")
    .filter({ hasText: playerName })
    .first();
}
