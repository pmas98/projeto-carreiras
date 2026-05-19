import type { Page } from "@playwright/test";

export const TASK_ROUTES = [
  "/product-owner/stakeholder-meeting",
  "/product-owner/defining-product",
  "/product-owner/ticket-creation",
  "/frontend/frontend_inspector",
  "/frontend/frontend_framer",
  "/frontend/frontend_a11y",
  "/devops/devops_incident_response",
  "/devops/devops_deployment_pipeline",
  "/devops/devops_infrastructure_scaling",
  "/backend/backend_api_client",
  "/backend/backend_auth",
  "/backend/backend_data_fetching",
] as const;

export const ROLE_PAGES = [
  "/",
  "/product-owner",
  "/devops",
  "/frontend",
  "/backend",
] as const;

export async function clearProgress(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
}
