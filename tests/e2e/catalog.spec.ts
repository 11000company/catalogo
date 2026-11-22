import { test, expect } from "@playwright/test";

test("filtering to a category with no development projects shows only matching cards", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "E-commerce" }).click();
  await expect(page.getByText("Havoc")).toBeVisible();
  await expect(page.getByText("Aurora Hospedagens")).not.toBeVisible();
});

test("search with no matches shows empty state", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder(/buscar projeto/i).fill("xyznomatch");
  await expect(page.getByText(/nenhum projeto encontrado/i)).toBeVisible();
});
