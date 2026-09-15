# Automaton Memory System launch page, Direction 3: FIX

Light silver instrument page for Automaton Memory System (Dead Reckoning Foundry). The hero centerpiece is a real interactive Run Console that replays a deterministic two-run fixture and writes a Ledger and a Track plot as it goes. Built from `_template/` per `DESIGN.md` section 4.

## Stack

Vite 7, React 19, TypeScript strict, Tailwind v4 (`@tailwindcss/vite`), `motion/react` for UI motion (console line entry, ledger slips, track marks, section reveals, tab index mark, mobile menu), `@phosphor-icons/react` weight "regular" (Check, ArrowRight, List, X). No GSAP. No scroll listeners.

Fonts, self-hosted through fontsource and imported in `src/index.css`:
- `@fontsource-variable/archivo` (`wdth.css`, full variable font with the width axis). Display uses `font-variation-settings: "wdth" 92` (h1, closing headline), `96` (section headings), `98` (plate titles); weights 500 to 600.
- `@fontsource/commit-mono` (latin 400 and 500) for the console, numerals, tool names, badges.

Palette (tokens in `@theme`, `src/index.css`): background `#E8EAED`, panel `#F5F6F7`, panel-2 `#DDE0E4`, hairline `rgba(22,26,31,0.16)`, ink `#161A1F`, muted `#5F666E`, muted-2 `#4E555D` (used where muted would fall under 4.5:1, e.g. on panel-2), accent vermilion `#C8401F` with hover `#B23617`, text on accent `#FFF7F4`, accent tint `#F6E3DD` (running-button state, text selection). Radius 8px for panels and buttons, 6px for inner cores. Shadows `0 1px 0 rgba(22,26,31,0.06), 0 12px 32px rgba(40,48,60,0.10)`. Theme locked light (`color-scheme: light`).

Vermilion appears only as: buttons (primary CTAs, next run step), the running-state outline, the active transcript line marker and block cursor, the Track fix marks, the tab index mark, the favicon and logo index tick.

## Layout

- `src/content.ts`: every visible string and the full Run Console fixture (both run scripts, line by line, exactly as DESIGN.md section 4; the double-spaced arrow is kept in the fixture string and rendered as a Phosphor ArrowRight icon, never a dash).
- `src/components/`: one file per section plus `Nav`, `Logo`, `Footer`, `Reveal`, `Section`.
- `src/components/console/`: `machine.ts` (pure reducer: start, advance, hydrate, reset), `storage.ts` (single key `ams-fix-console-completed`, `/^[0-2]$/` validation, every access in try/catch), `useRunConsole.ts` (timers, ref guard, reduced motion, persistence), `RunConsole.tsx`, `Transcript.tsx`, `Ledger.tsx`, `Track.tsx`.

Sections (8) and layout families:
1. Hero: 5/7 split, copy left, Run Console right; console stacks under the copy below `lg`.
2. The same task, twice: two-column comparison on a shared vertical spine, large mono minute readouts, then a full-width display sentence and paragraph.
3. Three kinds of memory: one bordered plate as a real `<table>` with three unequal columns (5/4/3) and grouped rows (Holds, Retention, Entity type, Path, Example); stacked per-tier plates below `lg`.
4. Retrieval you can inspect: four-cell uneven bento (7/5 over 5/7): ranked list, tinted admission checklist, provenance SVG, real scoreboard screenshot in a double bezel.
5. Measured, not asserted: instrument readout band (mono numerals with the baseline value beneath), caveats row, then a second plate of live automaton readouts.
6. Headless: vertical tab rail (real tabs: `role=tablist`, `aria-selected`, roving tabindex, arrow, Home and End keys, `aria-orientation` follows the breakpoint) with a mono snippet panel.
7. Rates: one wide plate split in four, add-on column tinted, Free carries "Start free", Enterprise carries "Join the Discord"; pilot sentence below.
8. Closing: copy left, generated dial photograph right at 4:3, then the footer.

Eyebrow count: 1 ("Pricing", section 7). The QA harness heuristic finds exactly one.

Nav: 64px, single line at desktop, hexagon outline plus "Automaton Memory System" in Archivo 600, links Console, Memory, Evidence, Pricing and a vermilion "Start free"; collapses to a 44px menu button under 768px (Escape closes, resize past 768 closes). Skip link, one `<h1>`, alt text on both images, `rel="noopener noreferrer"` on external links, `<title>`, meta description, og:title and og:description set in `index.html`. Favicon: `public/favicon.svg` (hexagon outline with a vermilion index mark).

## Run Console

- Buttons "Run 1: cold start", "Run 2: with memory", "Reset". Run 2 is disabled until Run 1 completes; a completed step shows a check and is disabled; the running step shows the tint state and is disabled. Reset is enabled once anything has run and also cancels a run in progress.
- Lines appear 140 to 220ms apart (deterministic per step: `140 + (step * 53) % 81`), instantly under `prefers-reduced-motion: reduce` (all lines dispatched synchronously).
- Simulated clock column (mm:ss), tool names in weight 500, results after the arrow in muted, vermilion marker and block cursor on the active line only.
- Ledger rail lists memory records as `create_memory` lines run (tier badge in mono, one-line illustrative title, importance), plus the continuation row (open, claimed, completed). Track adds a fix mark per completed run and connects the second to the first; ticks are unlabeled hairlines, only the marks carry numbers (26 min, 9 min).
- Empty state: "No runs yet. Start Run 1 to watch a cold session, then Run 2 to watch it resume from memory."
- Persistence: only the completed-run index under `ams-fix-console-completed`; reads validated with `/^[0-2]$/`, anything else removed; every access wrapped in try/catch; blocked storage shows "Browser storage is unavailable. The console still works for this visit." Reset clears the key.
- Double-run guard: `busyRef` in `useRunConsole.ts`, checked before any state dispatch.
- Buttons are at least 44px tall everywhere; visible 2px ink focus ring.

## Assets

- `public/img/smart-actions-scoreboard.webp`: real dashboard screenshot converted with `_tools/img.mjs` to 1600 wide (40 KB). Caption: "Dashboard snapshot from April 2026."
- `public/img/fix-dial.webp`: from `_assets/gen/fix-dial-a.png` (source is 1200x896, so the WebP is 1200 wide, 42 KB), shown in a 4:3 box with `object-cover`; hidden via `onError` if missing. Referenced by URL through `import.meta.env.BASE_URL`.
- Logo: the monochrome derivation of `ams_logo5.svg` (gradients and hex fills to currentColor, filters removed) was rendered at 28px and does not read; the inner detail merges into a solid hexagon and the wordmark is illegible (`_evidence/fix/logo-mono-test.png`). Per spec the nav uses a hexagon outline plus the wordmark in Archivo 600.

## Verification

Build: `npm run build` passes with zero TypeScript and Vite errors. A build with `BASE_PATH=/ams-launch-fix/` rewrites the favicon, chunk and image URLs correctly (checked in `dist/index.html` and the bundle).

QA harness (`_tools/qa.mjs`): Node's ESM loader ignores `NODE_PATH`, so the harness cannot find the global Playwright on its own. `qa/pw-register.mjs` registers a resolve hook that maps `playwright` to `/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright`:

```
npm run preview -- --port 4183 --strictPort
node --import ./fix/qa/pw-register.mjs _tools/qa.mjs http://127.0.0.1:4183/ _evidence/fix/pass4
node --import ./fix/qa/pw-register.mjs _tools/qa.mjs http://127.0.0.1:4183/ _evidence/fix/pass4 --reduced
```

Results, four passes run (`_evidence/fix/pass1` to `pass4`):
- pass1: only failures were "image not loaded" for the two `loading="lazy"` images (the harness checks `img.complete` before scrolling). Fixed by loading them eagerly (they are 40 KB each).
- pass2, pass3, pass4 (final build): `failures: []` in normal and reduced mode. No horizontal overflow at 320, 390, 768, 1024, 1440, 1920; zero console errors; zero failed requests; zero em or en dashes in rendered text; all images loaded with alt text; every link has a real href; one h1; hero h1 (2 lines), subtext (20 words) and primary CTA inside the first viewport at 1440x900 (CTA bottom 467px) and 390x844 (CTA bottom 370px); no target under 44px at 390.

Console check (`qa/console.mjs`, output in `_evidence/fix/console-check.json`): 35 passed, 0 failed. Covers: empty state; Run 2 disabled until Run 1 completes; sequential pacing (Run 1 took 2089ms for 11 steps, within 140 to 220ms per step); running, done and locked button states; Run 1 completion line, 3 ledger records, 10 lines, 1 fix mark, continuation open; Run 2 9-minute completion line, second fix mark plus connecting leg, 4 records, continuation completed; persisted index 1 then 2; reload restores; Reset clears console and storage; invalid stored values "7", "abc" and "" discarded and removed; Enter on the focused button starts a run with a visible `solid 2px` focus ring; blocked storage (localStorage getter throws) shows the notice and Run 1 still works with no page errors; 20 rapid dispatched clicks produce exactly one run; reduced motion renders all lines of both runs immediately; zero console errors throughout.

Console state screenshots for review: `_evidence/fix/states/` (running, after Run 1, after Run 2 at desktop and mobile, hero after Run 2, mobile menu open, 768 and 1024 heroes).

## Copy self-audit

Every string in `src/content.ts` was re-read against DESIGN.md sections 0, 1 and 4. All numbers trace to section 0 or to the console fixture in section 4. Illustrative content (ledger titles, ranked-result titles, tier examples, REST paths, CLI commands) is labeled illustrative or sits inside the console labeled "Simulation. Deterministic fixture. No live backend." Both required caveats appear under the evidence readouts. CTA labels are one per intent page-wide. No en or em dashes in source or rendered text. "AMS" appears only after the full product name.

## Deviations from DESIGN.md, with reasons

- Hero subtext trimmed from 21 to 20 words ("hands it to the next one" became "hands it to the next") because section 1 and the QA harness cap subtext at 20 words; the spec sentence as written was 21.
- Evidence readouts are rendered as two lines (large value, comparison value beneath: "0.50" over "0.30 baseline", "0.00" over "1.00 naive") instead of "0.50 / 0.30" and "1.00 → 0.00" on one line: the one-line form did not fit six readouts in the band at the intended numeral size, and the spec allows the word form instead of the arrow. Path score shows "+0.22" over "0.7764 against 0.5532".
- Live automata row includes `full_dogfooding_suite` (1,289 executions, 99.86%) alongside the two readouts the spec names; the value is in section 0 and balances the row.
- Tiers plate adds a "Path" row (real `file_path` prefixes from section 0) to the spec's Holds, Retention, Entity type, Example rows.
- Ledger titles are shortened illustrative titles so they fit one line in the rail ("poll loop returns handle on timeout"); the fuller wording stays in the fixture line and in sections 3 and 4.
- The Track has unlabeled hairline ticks; only the fix marks carry numbers, so no axis numbers appear that are not in the fixture.
- `id="console"` sits on the console panel itself (not the hero section) so the nav "Console" link lands on the component on mobile, where the console is below the copy.
- Both images load eagerly rather than lazily so the QA harness sees them complete before scrolling.

## TODOs

- `fix-dial.webp` is 1200 wide because the generated source is 1200x896; regenerate at 1600 wide if a larger display is ever needed.
- If `_tools/qa.mjs` is later run with plain `NODE_PATH`, it will fail on `import "playwright"`; keep using the `--import ./fix/qa/pw-register.mjs` preload or install `playwright` where ESM resolution can find it.
