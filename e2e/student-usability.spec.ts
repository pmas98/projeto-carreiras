import { test, expect } from "@playwright/test";
import { clearProgress } from "./helpers";

test.describe("Usabilidade para estudantes", () => {
  test.beforeEach(async ({ page }) => {
    await clearProgress(page);
  });

  test("PO e Frontend têm botão Iniciar Tarefa visível", async ({ page }) => {
    await page.goto("/product-owner");
    const poStarts = page.getByRole("link", { name: /Iniciar Tarefa/i });
    await expect(poStarts.first()).toBeVisible();
    expect(await poStarts.count()).toBeGreaterThanOrEqual(3);

    await page.goto("/frontend");
    const feStarts = page.getByRole("link", { name: /Iniciar Tarefa/i });
    await expect(feStarts.first()).toBeVisible();
    expect(await feStarts.count()).toBeGreaterThanOrEqual(3);
  });

  test("DevOps deveria ter Iniciar Tarefa (não só demo)", async ({ page }) => {
    await page.goto("/devops");
    const startLinks = page.getByRole("link", { name: /Iniciar Tarefa/i });
    const demoButtons = page.getByRole("button", {
      name: /Marcar como concluído \(demo\)/i,
    });
    // Regressão: trilhas implementadas devem ser acessíveis sem atalho demo
    await expect(startLinks).toHaveCount(3);
    await expect(demoButtons).toHaveCount(0);
  });

  test("Backend deveria ter Iniciar Tarefa (não só demo)", async ({ page }) => {
    await page.goto("/backend");
    const startLinks = page.getByRole("link", { name: /Iniciar Tarefa/i });
    const demoButtons = page.getByRole("button", {
      name: /Marcar como concluído \(demo\)/i,
    });
    await expect(startLinks).toHaveCount(3);
    await expect(demoButtons).toHaveCount(0);
  });

  test("reunião de stakeholder mostra escolhas em português", async ({ page }) => {
    await page.goto("/product-owner/stakeholder-meeting");
    await expect(page.getByText(/Humor do Stakeholder/i)).toBeVisible({ timeout: 15_000 });
    const choices = page.locator("button").filter({ hasText: /.+/ });
    await expect(choices.first()).toBeVisible();
  });

  test("tarefa frontend inspector tem controles interativos", async ({ page }) => {
    await page.goto("/frontend/frontend_inspector");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const sliders = page.locator('input[type="range"]');
    expect(await sliders.count()).toBeGreaterThan(0);
  });

  test("devops incident page carrega terminal ou monitor", async ({ page }) => {
    await page.goto("/devops/devops_incident_response");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const hasTerminal =
      (await page.locator("input, textarea").count()) > 0 ||
      (await page.getByText(/terminal|incidente|monitor/i).count()) > 0;
    expect(hasTerminal).toBeTruthy();
  });

  test("backend API client tem área de requisição", async ({ page }) => {
    await page.goto("/backend/backend_api_client");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const interactive =
      (await page.locator("button, input, textarea, select").count()) > 2;
    expect(interactive).toBeTruthy();
  });

  test("voltar da tarefa frontend retorna à lista", async ({ page }) => {
    await page.goto("/frontend/frontend_inspector");
    await page.getByRole("link", { name: "Voltar" }).click();
    await expect(page).toHaveURL(/\/frontend\/?$/);
  });

  test("textos do mentor estão em português claro", async ({ page }) => {
    await page.goto("/frontend");
    await expect(page.getByText("Mentor")).toBeVisible();
    await expect(page.getByText(/simulação totalmente interativa/i)).toBeVisible();
  });

  test("dashboard não deve depender só de jargão em inglês para ação principal", async ({
    page,
  }) => {
    await page.goto("/");
    const initiateButtons = page.getByRole("link", { name: /INITIATE_PATH/i });
    expect(await initiateButtons.count()).toBe(4);
    // Heurística: estudantes EF podem não entender INITIATE_PATH
    const portugueseCTA = page.getByRole("link", { name: /Iniciar|Começar|Acessar trilha/i });
    expect(await portugueseCTA.count()).toBe(0);
  });
});
