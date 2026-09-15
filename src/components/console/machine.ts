// Pure state machine for the Run Console. No timers, no DOM, no storage: the hook owns those.
import { runs, type ContinuationStatus, type LedgerRecord, type RunScript } from "../../content";

export type RunIndex = 1 | 2;
export type Completed = 0 | 1 | 2;

export type LedgerEntry = LedgerRecord & { id: string; run: RunIndex; t: string };

export type TranscriptLine =
  | { kind: "divider"; id: string; run: RunIndex; label: string }
  | { kind: "line"; id: string; run: RunIndex; t: string; text: string }
  | { kind: "complete"; id: string; run: RunIndex; text: string };

export type ConsoleState = {
  completed: Completed;
  running: RunIndex | null;
  cursor: number;
  lines: TranscriptLine[];
  ledger: LedgerEntry[];
  continuation: ContinuationStatus | null;
};

export type Action =
  | { type: "start"; run: RunIndex }
  | { type: "advance" }
  | { type: "hydrate"; completed: 1 | 2 }
  | { type: "reset" };

export const initialState: ConsoleState = {
  completed: 0,
  running: null,
  cursor: 0,
  lines: [],
  ledger: [],
  continuation: null,
};

export function scriptFor(run: RunIndex): RunScript {
  return runs[run - 1];
}

/** Advance steps needed to finish a run: every fixture line plus the completion line. */
export function stepsFor(run: RunIndex): number {
  return scriptFor(run).lines.length + 1;
}

export function canStart(state: ConsoleState, run: RunIndex): boolean {
  if (state.running !== null) return false;
  return run === 1 ? state.completed === 0 : state.completed === 1;
}

export function reducer(state: ConsoleState, action: Action): ConsoleState {
  switch (action.type) {
    case "start": {
      if (!canStart(state, action.run)) return state;
      const script = scriptFor(action.run);
      return {
        ...state,
        running: action.run,
        cursor: 0,
        lines: [...state.lines, { kind: "divider", id: `r${action.run}-divider`, run: action.run, label: script.label }],
      };
    }
    case "advance": {
      if (state.running === null) return state;
      const run = state.running;
      const script = scriptFor(run);
      if (state.cursor < script.lines.length) {
        const fx = script.lines[state.cursor];
        const id = `r${run}-l${state.cursor}`;
        return {
          ...state,
          cursor: state.cursor + 1,
          lines: [...state.lines, { kind: "line", id, run, t: fx.t, text: fx.text }],
          ledger: fx.writes ? [...state.ledger, { ...fx.writes, id, run, t: fx.t }] : state.ledger,
          continuation: fx.continuation ?? state.continuation,
        };
      }
      return {
        ...state,
        running: null,
        cursor: 0,
        completed: run,
        lines: [...state.lines, { kind: "complete", id: `r${run}-complete`, run, text: script.complete }],
      };
    }
    case "hydrate": {
      let s = initialState;
      for (const run of [1, 2] as const) {
        if (run > action.completed) break;
        s = reducer(s, { type: "start", run });
        const steps = stepsFor(run);
        for (let i = 0; i < steps; i++) s = reducer(s, { type: "advance" });
      }
      return s;
    }
    case "reset":
      return initialState;
  }
}
