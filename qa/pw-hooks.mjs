// Node ESM ignores NODE_PATH, so `import "playwright"` from _tools/qa.mjs cannot see the
// globally installed copy. This hook maps the bare "playwright" specifier to it.
// Usage: node --import ./fix/qa/pw-register.mjs ../_tools/qa.mjs <url> <outdir> [--reduced]
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const candidates = [
  process.env.PLAYWRIGHT_PKG,
  "/opt/homebrew/lib/node_modules/playwright",
  "/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright",
].filter(Boolean);

export function findPlaywright() {
  const dir = candidates.find((p) => existsSync(p));
  if (!dir) throw new Error("playwright package not found; set PLAYWRIGHT_PKG");
  return dir;
}

export function resolve(specifier, context, next) {
  if (specifier === "playwright") {
    const dir = findPlaywright();
    const entry = existsSync(`${dir}/index.mjs`) ? `${dir}/index.mjs` : `${dir}/index.js`;
    return { url: pathToFileURL(entry).href, shortCircuit: true };
  }
  return next(specifier, context);
}
