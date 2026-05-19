import { test, expect } from "@playwright/test";

test.describe("Mobile (Pixel 7)", () => {
  test.use({ viewport: { width: 412, height: 915 } });

  test("dashboard é utilizável sem scroll horizontal", async ({ page }) => {
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test("cards de trilha são clicáveis no mobile", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /INITIATE_PATH/ }).first().click();
    await expect(page).not.toHaveURL("/");
  });

  test("stakeholder meeting cabe na viewport", async ({ page }) => {
    await page.goto("/product-owner/stakeholder-meeting");
    await expect(page.locator("body")).toBeVisible();
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 20;
    });
    expect(overflow).toBeFalsy();
  });

  test("frontend inspector sliders acessíveis no touch", async ({ page }) => {
    await page.goto("/frontend/frontend_inspector");
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible();
    await slider.focus();
    expect(await slider.evaluate((el) => document.activeElement === el)).toBeTruthy();
  });
});
