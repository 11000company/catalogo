import { test, expect } from "@playwright/test";

test("sitemap and robots are generated", async ({ page }) => {
  const sitemapRes = await page.goto("/sitemap.xml");
  expect(sitemapRes?.status()).toBe(200);
  const robotsRes = await page.goto("/robots.txt");
  expect(robotsRes?.status()).toBe(200);
});
