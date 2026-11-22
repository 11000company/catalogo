import { test, expect } from "@playwright/test";

test("sitemap and robots are generated", async ({ page }) => {
  const sitemapRes = await page.goto("/sitemap.xml");
  expect(sitemapRes?.status()).toBe(200);
  const robotsRes = await page.goto("/robots.txt");
  expect(robotsRes?.status()).toBe(200);
});

test("without NEXT_PUBLIC_SITE_URL, robots.txt disallows crawling and pages are noindex", async ({
  page,
}) => {
  const robotsRes = await page.goto("/robots.txt");
  const robotsBody = await robotsRes?.text();
  expect(robotsBody).toContain("Disallow: /");

  await page.goto("/");
  const robotsMeta = page.locator('meta[name="robots"]');
  await expect(robotsMeta).toHaveAttribute("content", /noindex/);
});
