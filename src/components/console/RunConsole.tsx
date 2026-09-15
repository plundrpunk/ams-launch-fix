import { Check } from "@phosphor-icons/react";
import { consoleCopy } from "../../content";
import { Ledger } from "./Ledger";
import type { Completed, RunIndex } from "./machine";
import { Track } from "./Track";
import { Transcript } from "./Transcript";
import { useRunConsole } from "./useRunConsole";

type ButtonState = "next" | "running" | "done" | "locked";

function buttonState(run: RunIndex, completed: Completed, running: RunIndex | null): ButtonState {
  if (running === run) return "running";
  if (completed >= run) return "done";
  if (running === null && completed === run - 1) return "next";
  return "locked";
}

const stateClass: Record<ButtonState, string> = {
  next: "btn-primary",
  running: "btn-running",
  done: "btn-done",
  locked: "btn-outline",
};

type RunButtonProps = { label: string; state: ButtonState; onClick: () => void; testId: string; className?: string };

function RunButton({ label, state, onClick, testId, className = "" }: RunButtonProps) {
  return (
    <button
      type="button"
      className={`btn ${stateClass[state]} ${className}`}
      onClick={onClick}
      disabled={state !== "next"}
      aria-busy={state === "running" || undefined}
      data-testid={testId}
      data-state={state}
    >
      {state === "done" && <Check size={16} weight="regular" aria-hidden="true" />}
      {label}
    </button>
  );
}

export function RunConsole() {
  const { state, start, reset, storageBlocked, hydrated } = useRunConsole();
  const { completed, running } = state;
  const run1 = buttonState(1, completed, running);
  const run2 = buttonState(2, completed, running);
  const canReset = running !== null || state.lines.length > 0;

  return (
    <div
      id="console"
      className="plate scroll-mt-24 overflow-hidden"
      role="region"
      aria-label={consoleCopy.title}
      data-testid="console"
      data-completed={completed}
    >
      <div className="flex min-h-[44px] flex-col justify-center gap-0.5 border-b border-hairline px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0 sm:px-5">
        <h2 className="text-[13px] font-medium">{consoleCopy.title}</h2>
        <span className="font-mono text-[11.5px] leading-tight text-muted-2 sm:text-right">{consoleCopy.simulationLabel}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-4 py-3 sm:px-5">
        <RunButton label={consoleCopy.run1} state={run1} onClick={() => start(1)} testId="run-1" className="w-full sm:w-auto" />
        <RunButton label={consoleCopy.run2} state={run2} onClick={() => start(2)} testId="run-2" className="flex-1 sm:flex-none" />
        <button type="button" className="btn btn-ghost ml-auto" onClick={reset} disabled={!canReset} data-testid="reset">
          {consoleCopy.reset}
        </button>
      </div>
      <div className="grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Transcript lines={state.lines} running={running} hydrated={hydrated} />
        <aside
          className="flex flex-col border-t border-hairline bg-bg md:h-[484px] md:border-t-0 md:border-l"
          aria-label={`${consoleCopy.ledger} and ${consoleCopy.track}`}
        >
          <Ledger entries={state.ledger} continuation={state.continuation} />
          <Track completed={completed} />
        </aside>
      </div>
      {storageBlocked && (
        <p role="status" className="border-t border-hairline px-4 py-2.5 text-[12.5px] text-muted-2 sm:px-5" data-testid="storage-notice">
          {consoleCopy.storageNotice}
        </p>
      )}
    </div>
  );
}
