import { expect, test } from "@playwright/test";

import { expectQuestionProgress, openApp, seedDirectRouteState } from "./helpers";

test("Таймер вопроса: никто не нажал -> таймаут -> вопрос закрывается", async ({ page }) => {
  await seedDirectRouteState(page, {
    routeLock: "game",
    activeQuestionId: "r1-startups-100",
    questionFlow: {
      questionId: "r1-startups-100",
      phase: "reading",
      remainingMs: 150,
      attemptedPlayerIds: [],
      activePlayerId: null,
      answerInput: "",
    },
    scores: { p1: 0, p2: 0, p3: 0 },
    openedQuestionIds: [],
    isRoundFirstPickDone: true,
  });

  await openApp(page);

  await expect(page.getByText("Нажмите вашу клавишу, чтобы ответить!")).toBeVisible();
  await expect(page.getByText("Время вышло")).toBeVisible({ timeout: 6_000 });

  await page.getByRole("button", { name: "Продолжить" }).click();
  await expectQuestionProgress(page, 1);
});
