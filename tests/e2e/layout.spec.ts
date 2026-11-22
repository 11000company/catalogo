import { test, expect } from "@playwright/test";

test("header and footer render with working links", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /iniciar um projeto/i }),
  ).toHaveAttribute("href", /wa\.me/);
  await expect(page.getByRole("link", { name: /instagram/i })).toHaveAttribute(
    "href",
    "https://instagram.com/onzemil.company",
  );
});
