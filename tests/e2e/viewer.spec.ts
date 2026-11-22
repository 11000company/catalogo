import { test, expect } from "@playwright/test";

test("viewer opens, switches device size, and closes on Escape", async ({ page }) => {
  await page.goto("/projetos/aurora-hospedagens");
  await page.getByRole("button", { name: /ver demonstração/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: /mobile|celular/i }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("euclides-fitness viewer never renders an iframe", async ({ page }) => {
  await page.goto("/projetos/euclides-fitness");
  await page.getByRole("button", { name: /ver demonstração|galeria/i }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("iframe that never loads falls back within the timeout window", async ({ page }) => {
  await page.route("**/*", async (route, request) => {
    if (request.url().includes("aurorahospedagens.com")) {
      await new Promise(() => {});
    } else {
      await route.continue();
    }
  });
  await page.goto("/projetos/aurora-hospedagens");
  await page.getByRole("button", { name: /ver demonstração/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText(/não foi possível carregar|abrir site original/i),
  ).toBeVisible({ timeout: 12000 });
});
