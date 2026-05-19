import { test, expect } from "@playwright/test";
import { ROLE_PAGES, TASK_ROUTES } from "./helpers";

test.describe("Navegação e carregamento", () => {
  for (const path of ROLE_PAGES) {
    test(`carrega ${path} sem erro`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("body")).toBeVisible();
    });
  }

  for (const path of TASK_ROUTES) {
    test(`carrega tarefa ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByRole("heading").first()).toBeVisible();
    });
  }

  test("dashboard exibe as 4 trilhas de carreira", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /CAREER ARCHITECT/i })).toBeVisible();
    await expect(page.getByText("Product Owner")).toBeVisible();
    await expect(page.getByRole("heading", { name: "DevOps" })).toBeVisible();
    await expect(page.getByText("Desenvolvedor Frontend")).toBeVisible();
    await expect(page.getByText("Desenvolvedor Backend")).toBeVisible();
  });

  test("breadcrumb Painel leva de volta ao dashboard", async ({ page }) => {
    await page.goto("/frontend");
    await page.getByRole("link", { name: "Painel" }).click();
    await expect(page).toHaveURL("/");
  });

  test("link da trilha Product Owner abre a página correta", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/product-owner"]').click();
    await expect(page).toHaveURL(/\/product-owner/);
  });
});
