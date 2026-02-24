import { expect, test } from "@playwright/test";

import { openApp, seedSetupState, startGameFromSetup } from "./helpers";

test("Start / Setup: 3 игрока -> старт -> табло 1 раунда", async ({ page }) => {
  await seedSetupState(page);
  await openApp(page);
  await startGameFromSetup(page);

  await expect(page).toHaveURL(/#\/game/);
  await expect(page.getByText("Questions: 0/30")).toBeVisible();
});
