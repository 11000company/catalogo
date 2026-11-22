import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const OUT_DIR = "public/images/projects/aurora-hospedagens";
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto("https://www.aurorahospedagens.com/", { waitUntil: "load", timeout: 30000 });
await desktop.waitForTimeout(2000);
await desktop.screenshot({ path: `${OUT_DIR}/cover.webp`, type: "webp", quality: 82 });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("https://www.aurorahospedagens.com/", { waitUntil: "load", timeout: 30000 });
await mobile.waitForTimeout(2000);
await mobile.screenshot({ path: `${OUT_DIR}/mobile.webp`, type: "webp", quality: 82 });

await browser.close();
console.log("Screenshots captured successfully.");
