// Run Console behaviour check.
// usage: node qa/console.mjs [url] [out.json]
// Playwright is resolved from the global install (see pw-hooks.mjs); NODE_PATH is honored by createRequire.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findPlaywright } from "./pw-hooks.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(findPlaywright());

const here = dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] ?? "http://127.0.0.1:4183/";
const out = process.argv[3] ?? join(here, "../../_evidence/fix/console-check.json");
const KEY = "ams-fix-console-completed";
const RUN1_LINES = 10;
const RUN2_LINES = 7;
const RUN1_COMPLETE = "Run 1 complete. 26 minutes simulated. 3 records written, 1 continuation left.";
const RUN2_COMPLETE = "Run 2 complete. 9 minutes simulated. Started from the last fix.";
const NOTICE = "Browser storage is unavailable. The console still works for this visit.";
const EMPTY = "No runs yet. Start Run 1 to watch a cold session, then Run 2 to watch it resume from memory.";

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail !== undefined ? " " + JSON.stringify(detail) : ""}`);
};

const browser = await chromium.launch();

async function open({ reduced = false, init = null } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  if (init) await page.addInitScript(init);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="console"]');
  return { ctx, page, errors };
}

const counts = (page) =>
  page.evaluate(() => ({
    lines: document.querySelectorAll('[data-testid="transcript-line"]').length,
    complete: document.querySelectorAll('[data-testid="complete-line"]').length,
    dividers: document.querySelectorAll('[data-kind="divider"]').length,
    records: document.querySelectorAll('[data-testid="ledger-record"]').length,
    marks: document.querySelectorAll('[data-testid="fix-mark"]').length,
    leg: document.querySelectorAll('[data-testid="track-leg"]').length,
    completed: document.querySelector('[data-testid="console"]')?.getAttribute("data-completed"),
    run1: document.querySelector('[data-testid="run-1"]')?.getAttribute("data-state"),
    run2: document.querySelector('[data-testid="run-2"]')?.getAttribute("data-state"),
    run1Disabled: document.querySelector('[data-testid="run-1"]')?.disabled,
    run2Disabled: document.querySelector('[data-testid="run-2"]')?.disabled,
    completeTexts: [...document.querySelectorAll('[data-testid="complete-line"]')].map((el) => el.textContent.trim()),
    continuation: document.querySelector('[data-testid="continuation"]')?.getAttribute("data-status") ?? null,
    empty: document.querySelector('[data-testid="empty"]')?.textContent.trim() ?? null,
    notice: document.querySelector('[data-testid="storage-notice"]')?.textContent.trim() ?? null,
    stored: (() => {
      try {
        return window.localStorage.getItem("ams-fix-console-completed");
      } catch {
        return "BLOCKED";
      }
    })(),
  }));

const waitComplete = (page, n, timeout = 15000) =>
  page.waitForFunction((n) => document.querySelectorAll('[data-testid="complete-line"]').length >= n, n, { timeout });

// 1 and 2: Run 1 then Run 2 in one visit ------------------------------------------------
{
  const { ctx, page, errors } = await open();
  let c = await counts(page);
  check("initial: empty state shown", c.empty === EMPTY, c.empty);
  check("initial: Run 2 disabled until Run 1 completes", c.run2Disabled === true && c.run2 === "locked", { run2: c.run2 });
  check("initial: Run 1 is the next step", c.run1 === "next" && c.run1Disabled === false);

  const t0 = Date.now();
  await page.click('[data-testid="run-1"]');
  await page.waitForTimeout(60);
  const mid = await counts(page);
  check("run 1: lines appear sequentially (not all at once)", mid.lines >= 0 && mid.lines < RUN1_LINES, { linesAfter60ms: mid.lines });
  check("run 1: button shows running state while running", mid.run1 === "running" && mid.run1Disabled === true, { run1: mid.run1 });
  await waitComplete(page, 1);
  const elapsed = Date.now() - t0;
  c = await counts(page);
  check("run 1: completion line text", c.completeTexts[0] === RUN1_COMPLETE, c.completeTexts[0]);
  check("run 1: ledger shows 3 records", c.records === 3, { records: c.records });
  check("run 1: 10 transcript lines", c.lines === RUN1_LINES, { lines: c.lines });
  check("run 1: one fix mark on the track", c.marks === 1, { marks: c.marks });
  check("run 1: continuation left open", c.continuation === "open", { continuation: c.continuation });
  check("run 1: paced between 140 and 220 ms per line", elapsed >= 11 * 140 - 50 && elapsed <= 11 * 220 + 1500, { elapsedMs: elapsed });
  check("run 1: persisted completed index 1", c.stored === "1", { stored: c.stored });
  check("run 1: Run 2 now enabled, Run 1 done", c.run2 === "next" && c.run2Disabled === false && c.run1 === "done", { run1: c.run1, run2: c.run2 });

  await page.click('[data-testid="run-2"]');
  await waitComplete(page, 2);
  c = await counts(page);
  check("run 2: 9-minute completion line", c.completeTexts[1] === RUN2_COMPLETE, c.completeTexts[1]);
  check("run 2: second fix mark and connecting leg", c.marks === 2 && c.leg === 1, { marks: c.marks, leg: c.leg });
  check("run 2: ledger shows 4 records", c.records === 4, { records: c.records });
  check("run 2: continuation completed", c.continuation === "completed", { continuation: c.continuation });
  check("run 2: persisted completed index 2", c.stored === "2", { stored: c.stored });
  check("run 2: both run buttons done and disabled", c.run1 === "done" && c.run2 === "done" && c.run1Disabled && c.run2Disabled);

  // 3: reload restores -------------------------------------------------------------------
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="console"][data-completed="2"]');
  c = await counts(page);
  check("reload: persisted state restores (2 runs, 4 records, 2 marks)", c.completed === "2" && c.records === 4 && c.marks === 2 && c.complete === 2, {
    completed: c.completed,
    records: c.records,
    marks: c.marks,
    completeLines: c.complete,
  });

  // Reset clears everything including storage
  await page.click('[data-testid="reset"]');
  await page.waitForTimeout(50);
  c = await counts(page);
  check("reset: clears console and storage", c.completed === "0" && c.records === 0 && c.marks === 0 && c.stored === null && c.empty === EMPTY, {
    completed: c.completed,
    stored: c.stored,
  });

  // 4: invalid stored values are discarded -----------------------------------------------
  for (const bad of ["7", "abc", ""]) {
    await page.evaluate(([k, v]) => window.localStorage.setItem(k, v), [KEY, bad]);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="empty"]');
    c = await counts(page);
    check(`invalid stored value ${JSON.stringify(bad)} is discarded`, c.completed === "0" && c.records === 0 && c.stored === null, {
      completed: c.completed,
      stored: c.stored,
    });
  }

  // keyboard: Enter on the focused button starts a run
  await page.focus('[data-testid="run-1"]');
  const focusVisible = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { matches: el.matches(":focus-visible"), outline: cs.outlineStyle + " " + cs.outlineWidth };
  });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(40);
  c = await counts(page);
  check("keyboard: Enter starts Run 1 with a visible focus ring", c.run1 === "running" && focusVisible.matches && focusVisible.outline.startsWith("solid"), focusVisible);
  await waitComplete(page, 1);
  check("no console errors during visit 1", errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}

// 5: blocked storage --------------------------------------------------------------------
{
  const { ctx, page, errors } = await open({
    init: () => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new Error("storage blocked");
        },
      });
    },
  });
  let c = await counts(page);
  check("blocked storage: notice shown", c.notice === NOTICE, c.notice);
  check("blocked storage: empty state still shown", c.empty === EMPTY);
  await page.click('[data-testid="run-1"]');
  await waitComplete(page, 1);
  c = await counts(page);
  check("blocked storage: Run 1 still works (3 records, completion line)", c.records === 3 && c.completeTexts[0] === RUN1_COMPLETE, { records: c.records });
  check("blocked storage: no page errors", errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}

// 6: rapid clicks -----------------------------------------------------------------------
{
  const { ctx, page, errors } = await open();
  await page.evaluate(() => {
    const b = document.querySelector('[data-testid="run-1"]');
    for (let i = 0; i < 20; i++) b.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  await waitComplete(page, 1);
  await page.waitForTimeout(2600); // long enough for a second phantom run to have finished
  const c = await counts(page);
  check("rapid clicks: exactly one run happened", c.complete === 1 && c.lines === RUN1_LINES && c.records === 3 && c.dividers === 1 && c.marks === 1, {
    completeLines: c.complete,
    lines: c.lines,
    records: c.records,
    dividers: c.dividers,
  });
  check("rapid clicks: no page errors", errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}

// 7: reduced motion ---------------------------------------------------------------------
{
  const { ctx, page, errors } = await open({ reduced: true });
  const immediate = await page.evaluate(() => {
    document.querySelector('[data-testid="run-1"]').click();
    return new Promise((r) =>
      setTimeout(
        () =>
          r({
            lines: document.querySelectorAll('[data-testid="transcript-line"]').length,
            complete: document.querySelectorAll('[data-testid="complete-line"]').length,
            records: document.querySelectorAll('[data-testid="ledger-record"]').length,
          }),
        30,
      ),
    );
  });
  check("reduced motion: all Run 1 lines appear immediately", immediate.lines === RUN1_LINES && immediate.complete === 1 && immediate.records === 3, immediate);
  const immediate2 = await page.evaluate(() => {
    document.querySelector('[data-testid="run-2"]').click();
    return new Promise((r) =>
      setTimeout(
        () =>
          r({
            lines: document.querySelectorAll('[data-testid="transcript-line"]').length,
            complete: document.querySelectorAll('[data-testid="complete-line"]').length,
            marks: document.querySelectorAll('[data-testid="fix-mark"]').length,
          }),
        30,
      ),
    );
  });
  check("reduced motion: all Run 2 lines appear immediately", immediate2.lines === RUN1_LINES + RUN2_LINES && immediate2.complete === 2 && immediate2.marks === 2, immediate2);
  check("reduced motion: no page errors", errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}

await browser.close();
const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ url, date: new Date().toISOString(), passed, failed, results }, null, 2));
console.log(`\n${passed} passed, ${failed} failed. Report: ${out}`);
process.exit(failed ? 1 : 0);
