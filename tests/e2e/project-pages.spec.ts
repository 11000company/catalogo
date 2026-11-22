import { test, expect } from "@playwright/test";

test("each project detail page loads with correct title", async ({ page }) => {
  await page.goto("/projetos/aurora-hospedagens");
  await expect(page).toHaveTitle(/Aurora Hospedagens/);
});

test("development-status project page has no live-preview button", async ({ page }) => {
  await page.goto("/projetos/havoc");
  await expect(page.getByRole("button", { name: /ver demonstração/i })).toHaveCount(0);
});

test("unknown slug renders 404", async ({ page }) => {
  const response = await page.goto("/projetos/does-not-exist");
  expect(response?.status()).toBe(404);
});

test("similar-project CTA includes project title", async ({ page }) => {
  await page.goto("/projetos/aurora-hospedagens");
  const link = page.getByRole("link", { name: /quero um projeto parecido/i });
  await expect(link).toHaveAttribute("href", /Aurora%20Hospedagens/);
});
