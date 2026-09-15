import { motion, useReducedMotion } from "motion/react";
import { consoleCopy, type ContinuationStatus } from "../../content";
import type { LedgerEntry } from "./machine";

type Props = { entries: LedgerEntry[]; continuation: ContinuationStatus | null };

export function Ledger({ entries, continuation }: Props) {
  const reduced = useReducedMotion();
  const count = entries.length === 0 ? "" : entries.length === 1 ? consoleCopy.recordsOne : consoleCopy.recordsMany(entries.length);
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="ledger">
      <div className="flex items-baseline justify-between px-4 pt-3 pb-2 sm:px-5">
        <h3 className="text-[13px] font-medium">{consoleCopy.ledger}</h3>
        <span className="font-mono text-[11.5px] text-muted" data-testid="ledger-count">
          {count}
        </span>
      </div>
      <div className="scroll-quiet min-h-0 flex-1 overflow-y-auto px-4 pb-3 sm:px-5">
        {entries.length === 0 ? (
          <p className="text-[12.5px] text-muted-2">{consoleCopy.ledgerEmpty}</p>
        ) : (
          <ol className="space-y-1.5">
            {entries.map((e) => (
              <motion.li
                key={e.id}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-core border border-hairline bg-panel px-2.5 py-1.5 shadow-[0_1px_0_rgba(22,26,31,0.04)]"
                data-testid="ledger-record"
                data-tier={e.tier}
                title={e.title}
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[11px] leading-[1.5]">
                  <span className="text-muted-2">{e.tier}</span>
                  <span className="tabular-nums text-ink">{String(e.importance)}</span>
                </div>
                <p className="truncate text-[12.5px] leading-[1.45] text-ink">{e.title}</p>
              </motion.li>
            ))}
          </ol>
        )}
        {continuation && (
          <div
            className="mt-3 border-t border-hairline-soft pt-2.5 font-mono text-[11.5px] leading-[1.5]"
            data-testid="continuation"
            data-status={continuation}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-2">{consoleCopy.continuation}</span>
              <span className="text-ink">{continuation}</span>
            </div>
            <p className="truncate text-muted-2">{consoleCopy.continuationText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
