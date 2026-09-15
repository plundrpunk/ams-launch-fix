// Every visible string on the page lives here so it can be audited against DESIGN.md
// sections 0, 1 and 4 in one place. Numbers come only from section 0 or from the
// console fixture in section 4.

export const links = {
  site: "https://automaton-memory.com/",
  startFree: "https://automaton-memory.com/Automaton-Abots.html#free-tier",
  whitepaper: "https://automaton-memory.com/whitepaper.html",
  github: "https://github.com/plundrpunk/automaton-abotv2",
  discord: "https://discord.gg/8fsh4TUw4",
} as const;

// One label per intent, page wide.
export const cta = {
  startFree: "Start free",
  whitepaper: "Read the whitepaper",
  discord: "Join the Discord",
  github: "View on GitHub",
} as const;

export const brand = {
  name: "Automaton Memory System",
  company: "Dead Reckoning Foundry",
  siteLabel: "automaton-memory.com",
  copyright: "© 2026 Dead Reckoning Foundry",
} as const;

export const nav = {
  skip: "Skip to content",
  home: "Automaton Memory System, back to top",
  links: [
    { label: "Console", href: "#console" },
    { label: "Memory", href: "#memory" },
    { label: "Evidence", href: "#evidence" },
    { label: "Pricing", href: "#pricing" },
  ],
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

export const hero = {
  headline: ["Every run", "leaves a fix."],
  subtext:
    "Automaton Memory System records what each agent run learned and hands it to the next, inside the scope you set.",
} as const;

// Run Console ---------------------------------------------------------------

export type Tier = "episodic" | "semantic" | "procedural";

export type LedgerRecord = {
  tier: Tier;
  /** Illustrative one-line title. The whole console is labeled a simulation. */
  title: string;
  importance: number;
};

export type ContinuationStatus = "open" | "claimed" | "completed";

export type FixtureLine = {
  /** Simulated clock, mm:ss. */
  t: string;
  /** Exact line text from DESIGN.md section 4. A double-spaced arrow separates call and result. */
  text: string;
  /** A memory record this line writes to the Ledger. */
  writes?: LedgerRecord;
  /** Continuation state change caused by this line. */
  continuation?: ContinuationStatus;
};

export type RunScript = {
  index: 1 | 2;
  label: string;
  minutes: number;
  lines: readonly FixtureLine[];
  complete: string;
};

export const RESULT_SEPARATOR = "  →  ";

export const consoleCopy = {
  title: "Run Console",
  simulationLabel: "Simulation. Deterministic fixture. No live backend.",
  run1: "Run 1: cold start",
  run2: "Run 2: with memory",
  reset: "Reset",
  transcript: "Transcript",
  clock: "Simulated clock",
  ledger: "Ledger",
  ledgerEmpty: "No records written.",
  recordsOne: "1 record",
  recordsMany: (n: number) => `${n} records`,
  continuation: "Continuation",
  continuationText: "verify fan-in after next deploy",
  track: "Track",
  trackCaption: "Simulated minutes per completed run.",
  trackEmpty: "No fix marks yet.",
  empty: "No runs yet. Start Run 1 to watch a cold session, then Run 2 to watch it resume from memory.",
  storageNotice: "Browser storage is unavailable. The console still works for this visit.",
  done: "complete",
  minutesShort: (n: number) => `${n} min`,
} as const;

export const runs: readonly [RunScript, RunScript] = [
  {
    index: 1,
    label: "Run 1: cold start",
    minutes: 26,
    lines: [
      { t: "00:00", text: 'bootstrap_session({ project: "fleet-autonomy" })  →  0 memories in scope' },
      { t: "00:04", text: "task: diagnose zero-completion loop in fleet dispatch" },
      { t: "03:50", text: "read worker logs, 412 lines, no root cause" },
      { t: "08:10", text: "restart dispatch workers  →  no change" },
      { t: "19:30", text: "trace poll loop: timeout returned without an execution handle" },
      { t: "24:00", text: "patch verified on staging" },
      {
        t: "25:10",
        text: 'create_memory({ memory_tier: "episodic", entity_type: "event", importance: 0.9 })',
        writes: { tier: "episodic", title: "dispatch timeout traced to poll loop", importance: 0.9 },
      },
      {
        t: "25:20",
        text: 'create_memory({ memory_tier: "semantic", entity_type: "concept", importance: 0.85 })',
        writes: { tier: "semantic", title: "dispatch timeout root cause", importance: 0.85 },
      },
      {
        t: "25:40",
        text: 'create_memory({ memory_tier: "procedural", entity_type: "procedure", importance: 0.92 })',
        writes: { tier: "procedural", title: "poll loop returns handle on timeout", importance: 0.92 },
      },
      {
        t: "26:00",
        text: 'create_continuation({ next_action: "verify fan-in after next deploy" })',
        continuation: "open",
      },
    ],
    complete: "Run 1 complete. 26 minutes simulated. 3 records written, 1 continuation left.",
  },
  {
    index: 2,
    label: "Run 2: with memory",
    minutes: 9,
    lines: [
      { t: "00:00", text: "claim_continuation()  →  goal and next action restored", continuation: "claimed" },
      {
        t: "00:02",
        text: 'search_memories({ query: "dispatch timeout root cause" })  →  3 records, relevance 0.877, 0.859, 0.852',
      },
      { t: "00:20", text: "skip: worker restart (recorded as ineffective)" },
      { t: "01:40", text: "apply procedure: poll loop returns execution handle on timeout" },
      { t: "06:30", text: "fan-in verified on all 17 workers" },
      {
        t: "08:40",
        text: 'create_memory({ memory_tier: "episodic", entity_type: "event", importance: 0.9 })',
        writes: { tier: "episodic", title: "fan-in verified on all 17 workers", importance: 0.9 },
      },
      { t: "09:00", text: "complete_continuation()", continuation: "completed" },
    ],
    complete: "Run 2 complete. 9 minutes simulated. Started from the last fix.",
  },
] as const;

// Section 2 -------------------------------------------------------------------

export const sameTask = {
  heading: "The same task, twice.",
  sourceLabel: "From the simulation above.",
  without: {
    title: "Without memory",
    rows: [
      { k: "Bootstrap", v: "Cold. 0 memories in scope." },
      { k: "Logs", v: "412 lines re-read. No root cause." },
      { k: "Restart", v: "Ineffective, and repeated." },
    ],
    minutes: 26,
    minutesLabel: "simulated minutes",
  },
  withMemory: {
    title: "With Automaton Memory System",
    rows: [
      { k: "Bootstrap", v: "Continuation claimed. Goal and next action restored." },
      { k: "Recall", v: "3 records. Relevance 0.877, 0.859, 0.852." },
      { k: "Restart", v: "Skipped. Recorded as ineffective last time." },
    ],
    minutes: 9,
    minutesLabel: "simulated minutes",
  },
  display: "The second run starts from the last fix, not from zero.",
  body: "Dead reckoning is how navigators worked before satellites: record every fix, and the next leg starts from a known position. Agent runs should work the same way.",
} as const;

// Section 3 -------------------------------------------------------------------

export const tiers = {
  heading: "Three kinds of memory, one substrate.",
  rows: ["Holds", "Retention", "Entity type", "Path", "Example"],
  columns: [
    {
      name: "Episodic",
      tier: "episodic",
      holds: "What happened. Sessions, events, decisions, outcomes.",
      retention: "730 days by default.",
      retentionMono: "ttl_days: 730",
      entity: "event",
      path: "02_Episodic_Log/",
      example: "prod deploy on 2026-09-13",
    },
    {
      name: "Semantic",
      tier: "semantic",
      holds: "What it means. Durable knowledge, concepts, facts.",
      retention: "Kept until superseded.",
      retentionMono: "no TTL",
      entity: "concept",
      path: "01_Semantic_Concepts/",
      example: "dispatch timeout root cause",
    },
    {
      name: "Procedural",
      tier: "procedural",
      holds: "How to do it again. Reviewed procedures and executable automata, each with a Wilson-score confidence interval.",
      retention: "Usage-based.",
      retentionMono: "usage-based",
      entity: "procedure",
      path: "03_Procedural_Heuristics/",
      example: "poll loop returns execution handle on timeout",
    },
  ],
  footnote: "Example titles are illustrative. Field names and paths are from the live API, 2026-09-15.",
} as const;

// Section 4 -------------------------------------------------------------------

export const retrieval = {
  heading: "Retrieval you can inspect. Writes you can defend.",
  hybrid: {
    title: "Hybrid retrieval",
    body: "Dense vectors plus BM25 keyword search, fused with reciprocal rank fusion. Scope rules for tenant, project, agent and connector apply first.",
    resultsLabel: "Ranked results. Illustrative titles, relevance scores from a live query on 2026-09-15.",
    results: [
      { score: "0.877", tier: "semantic", title: "dispatch timeout root cause" },
      { score: "0.859", tier: "procedural", title: "poll loop returns execution handle on timeout" },
      { score: "0.852", tier: "episodic", title: "dispatch worker restart: no change" },
    ],
  },
  admission: {
    title: "Write-path admission control",
    body: "Seven checks before anything becomes durable.",
    checks: ["control characters", "prompt injection", "PII", "malicious URLs", "length", "path traversal", "metadata"],
    pass: "pass",
  },
  provenance: {
    title: "Provenance graph",
    body: "Memories link to each other as prerequisites, references, decisions, sources and owners. Follow the chain with get_memory_links.",
    nodes: ["prerequisite", "reference", "decision", "source"],
  },
  scoreboard: {
    title: "Bayesian trust scoreboard",
    caption: "Dashboard snapshot from April 2026.",
    alt: "Automaton Memory System dashboard snapshot from April 2026 showing the Bayesian trust scoreboard for smart actions.",
  },
} as const;

// Section 5 -------------------------------------------------------------------

export const evidence = {
  heading: "Measured, not asserted.",
  framing: "67% higher task-success rate with 20% lower run cost on the same 10 tasks.",
  benchmarkLabel: "MemoryArena, held-out math tasks 10 to 19. Judge: claude-sonnet-4-6. March 25, 2026.",
  benchmarkNote: "Same model, same tasks; the memory layer is the variable. AMS H-MEM against a pure long-context baseline.",
  readouts: [
    { value: "0.50", sub: "0.30 baseline", label: "task success" },
    { value: "$33.28", sub: "$41.46 baseline", label: "cost" },
    { value: "+0.22", sub: "0.7764 against 0.5532", label: "path score" },
  ],
  safetyLabel: "Memory-safety harness. Defended memory, with the naive memory value beneath.",
  safetyNote: "Attack families: poisoning, cross-tenant leakage, extraction.",
  safety: [
    { value: "0.00", sub: "1.00 naive", label: "poisoning" },
    { value: "0.00", sub: "1.00 naive", label: "leakage" },
    { value: "1.00", sub: "0.00 naive", label: "blocked" },
  ],
  caveats: [
    "Broader-domain claims are left off this page until they replicate.",
    "Synthetic offline harness. No third-party audit or certification is implied.",
  ],
  liveLabel: "Live automata, measured 2026-09-15 via list_automata.",
  live: [
    { value: "203", label: "active automata", name: "" },
    { value: "22,422", label: "executions, 99.97% success", name: "vps_health_check_v2" },
    { value: "1,289", label: "executions, 99.86% success", name: "full_dogfooding_suite" },
  ],
} as const;

// Section 6 -------------------------------------------------------------------

export const interfaces = {
  heading: "Headless. MCP, REST, CLI.",
  body: "Claude Code, Codex, Cursor, Slack agents, internal agents, custom ABots.",
  tablistLabel: "Interface",
  tabs: [
    {
      id: "mcp",
      label: "MCP",
      note: "Eleven tools. Real names.",
      lines: [
        "bootstrap_session",
        "search_memories",
        "create_memory",
        "create_memory_link",
        "get_memory_links",
        "create_continuation",
        "claim_continuation",
        "complete_continuation",
        "what_worked",
        "list_automata",
        "execute_automaton",
      ],
    },
    {
      id: "rest",
      label: "REST",
      note: "Illustrative method and path lines.",
      lines: ["POST /memories", "GET  /memories/search", "POST /continuations"],
    },
    {
      id: "cli",
      label: "CLI",
      note: "Illustrative commands.",
      lines: ['ams search "dispatch timeout root cause"', "ams memory create --tier episodic", "ams continuation claim"],
    },
  ],
} as const;

// Section 7 -------------------------------------------------------------------

export const pricing = {
  eyebrow: "Pricing",
  heading: "Rates.",
  perMonth: "per month",
  plans: [
    { name: "Free", price: "$0", items: ["2 custom ABots", "100 memories"], cta: "startFree" },
    { name: "Professional", price: "$199", items: ["100,000 memories", "500 automata"], cta: null },
    { name: "Runtime add-on (AOS)", price: "+$299", items: ["Orchestration", "Approvals", "Traces"], cta: null, addon: true },
    { name: "Enterprise", price: "from $999", items: ["Multi-tenancy", "RBAC", "Self-host"], cta: "discord" },
  ],
  pilot: "Design-partner pilot: 3 slots, $500 per month for 90 days.",
} as const;

// Section 8 -------------------------------------------------------------------

export const closing = {
  heading: "Start from the last fix.",
  body: "Durable memory for agent teams, from Dead Reckoning Foundry.",
  imageAlt: "Silver instrument dial with fine tick marks and one red index mark.",
} as const;

export const footer = {
  links: [
    { label: brand.siteLabel, href: links.site },
    { label: cta.github, href: links.github },
    { label: cta.discord, href: links.discord },
    { label: cta.whitepaper, href: links.whitepaper },
  ],
} as const;
