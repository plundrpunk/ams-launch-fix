// Preload for the QA harness: node --import ./fix/qa/pw-register.mjs ../_tools/qa.mjs <url> <outdir> [--reduced]
import * as mod from "node:module";
import { resolve } from "./pw-hooks.mjs";

if (typeof mod.registerHooks === "function") mod.registerHooks({ resolve });
else mod.register("./pw-hooks.mjs", import.meta.url);
