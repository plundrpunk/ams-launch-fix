import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { canStart, initialState, reducer, stepsFor, type ConsoleState, type RunIndex } from "./machine";
import { clearCompleted, readCompleted, writeCompleted } from "./storage";

const MIN_DELAY_MS = 140;
const DELAY_SPAN_MS = 81; // 140 to 220 ms, deterministic per step

export function delayFor(step: number): number {
  return MIN_DELAY_MS + ((step * 53) % DELAY_SPAN_MS);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useRunConsole() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef<ConsoleState>(state);
  const busyRef = useRef(false); // ref guard: rapid clicks cannot double-run
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const r = readCompleted();
    if (r.blocked) setStorageBlocked(true);
    if (r.value === 1 || r.value === 2) dispatch({ type: "hydrate", completed: r.value });
    setHydrated(true);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const finish = useCallback((run: RunIndex) => {
    busyRef.current = false;
    timerRef.current = null;
    if (!writeCompleted(run)) setStorageBlocked(true);
  }, []);

  const start = useCallback(
    (run: RunIndex) => {
      if (busyRef.current) return;
      if (!canStart(stateRef.current, run)) return;
      busyRef.current = true;
      dispatch({ type: "start", run });
      const total = stepsFor(run);
      if (prefersReducedMotion()) {
        for (let i = 0; i < total; i++) dispatch({ type: "advance" });
        finish(run);
        return;
      }
      let step = 0;
      const tick = () => {
        dispatch({ type: "advance" });
        step += 1;
        if (step < total) timerRef.current = window.setTimeout(tick, delayFor(step));
        else finish(run);
      };
      timerRef.current = window.setTimeout(tick, delayFor(0));
    },
    [finish],
  );

  const reset = useCallback(() => {
    clearTimer();
    busyRef.current = false;
    dispatch({ type: "reset" });
    if (!clearCompleted()) setStorageBlocked(true);
  }, [clearTimer]);

  return { state, start, reset, storageBlocked, hydrated };
}
