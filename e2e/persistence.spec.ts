import { test, expect } from "@playwright/test";
import { clearProgress } from "./helpers";

test.describe("Persistência de progresso", () => {
  test("progresso salvo no localStorage persiste após reload", async ({
    page,
  }) => {
    await clearProgress(page);
    await page.evaluate(() => {
      localStorage.setItem(
        "ditltech.completedTasks.v1",
        JSON.stringify({ completedTasks: ["frontend_inspector"] })
      );
    });
    await page.goto("/frontend");
    await expect(page.getByText("1/3")).toBeVisible();
    await page.reload();
    await expect(page.getByText("1/3")).toBeVisible();
  });

  test("reset no dashboard limpa progresso", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "ditltech.completedTasks.v1",
        JSON.stringify({ completedTasks: ["frontend_inspector"] })
      );
    });

    await page.goto("/");
    await page.getByRole("button", { name: /INITIALIZE_RESET/i }).click();
    await page.reload();

    const progress = await page.evaluate(() =>
      localStorage.getItem("ditltech.completedTasks.v1")
    );
    expect(progress === null || progress === '{"completedTasks":[]}').toBeTruthy();
  });
});
