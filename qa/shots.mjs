// Console state screenshots for design review: node qa/shots.mjs [url] [outdir]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { findPlaywright } from "./pw-hooks.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(findPlaywright());
const url = process.argv[2] ?? "http://127.0.0.1:4183/";
const out = process.argv[3] ?? "../_evidence/fix/states";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const vp of [{ name: "w768", width: 768, height: 1024 }, { name: "w1024", width: 1024, height: 768 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: join(out, `${vp.name}-hero.png`) });
  await ctx.close();
}
for (const vp of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const consoleEl = page.locator('[data-testid="console"]');
  await consoleEl.scrollIntoViewIfNeeded();
  await page.click('[data-testid="run-1"]');
  await page.waitForTimeout(900);
  await consoleEl.screenshot({ path: join(out, `${vp.name}-console-running.png`) });
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="complete-line"]').length >= 1);
  await page.waitForTimeout(400);
  await consoleEl.screenshot({ path: join(out, `${vp.name}-console-run1.png`) });
  await page.click('[data-testid="run-2"]');
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="complete-line"]').length >= 2);
  await page.waitForTimeout(700);
  await consoleEl.screenshot({ path: join(out, `${vp.name}-console-run2.png`) });
  if (vp.name === "desktop") await page.screenshot({ path: join(out, "desktop-hero-run2.png") });
  if (vp.name === "mobile") {
    await page.click('button[aria-controls]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(out, "mobile-menu-open.png") });
  }
  await ctx.close();
}
await browser.close();
console.log("shots written to", out);
