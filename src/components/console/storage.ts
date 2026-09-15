// The only thing persisted is the completed-run index (0, 1 or 2) under one key.
// Every access is wrapped: blocked storage must never break the console.
export const STORAGE_KEY = "ams-fix-console-completed";
const VALID = /^[0-2]$/;

export type Completed = 0 | 1 | 2;
export type ReadResult = { value: Completed; blocked: boolean };

export function readCompleted(): ReadResult {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { value: 0, blocked: false };
    if (VALID.test(raw)) return { value: Number(raw) as Completed, blocked: false };
    // Anything else is discarded.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return { value: 0, blocked: false };
  } catch {
    return { value: 0, blocked: true };
  }
}

export function writeCompleted(value: Completed): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
    return true;
  } catch {
    return false;
  }
}

export function clearCompleted(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
