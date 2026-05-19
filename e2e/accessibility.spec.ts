import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES_TO_SCAN = [
  "/",
  "/product-owner",
  "/frontend",
  "/devops",
  "/backend",
  "/product-owner/stakeholder-meeting",
  "/frontend/frontend_a11y",
] as const;

test.describe("Acessibilidade (axe)", () => {
  for (const path of PAGES_TO_SCAN) {
    test(`sem violações críticas em ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "best-practice"])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (critical.length > 0) {
        console.log(
          JSON.stringify(
            critical.map((v) => ({
              id: v.id,
              impact: v.impact,
              description: v.description,
              nodes: v.nodes.length,
            })),
            null,
            2
          )
        );
      }

      expect(critical, `violações em ${path}`).toEqual([]);
    });
  }

  test("html lang é pt-BR", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("pt-BR");
  });

  test("botão voltar em tarefa frontend tem aria-label", async ({ page }) => {
    await page.goto("/frontend/frontend_inspector");
    await expect(page.getByRole("link", { name: "Voltar" })).toBeVisible();
  });
});
