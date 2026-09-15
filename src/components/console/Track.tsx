import { motion, useReducedMotion } from "motion/react";
import { consoleCopy, runs } from "../../content";
import type { Completed } from "./machine";

const W = 280;
const H = 100;
const BASE_Y = 84;
const PX_PER_MINUTE = 2.5; // 30 simulated minutes = 75px
const X = [84, 196] as const;
const TICKS = [10, 20, 30];

const yFor = (minutes: number) => BASE_Y - minutes * PX_PER_MINUTE;

export function Track({ completed }: { completed: Completed }) {
  const reduced = useReducedMotion();
  const marks = runs.slice(0, completed).map((r, i) => ({
    run: r.index,
    x: X[i] ?? X[1],
    y: yFor(r.minutes),
    label: consoleCopy.minutesShort(r.minutes),
  }));
  const description = marks.length === 0 ? consoleCopy.trackEmpty : marks.map((m) => `run ${m.run} at ${m.label}`).join(", ");

  return (
    <div className="shrink-0 border-t border-hairline px-4 pt-3 pb-3 sm:px-5" data-testid="track">
      <h3 className="text-[13px] font-medium">{consoleCopy.track}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-auto w-full" role="img" aria-label={`Track plot. ${description}.`}>
        {TICKS.map((m) => (
          <line key={m} x1={40} x2={W - 16} y1={yFor(m)} y2={yFor(m)} stroke="var(--color-hairline-soft)" strokeWidth="1" />
        ))}
        <line x1={40} x2={W - 16} y1={BASE_Y} y2={BASE_Y} stroke="var(--color-hairline)" strokeWidth="1" />
        {X.map((x, i) => (
          <text key={x} x={x} y={96} textAnchor="middle" fontSize="10" className="fill-muted font-mono">
            {`run ${i + 1}`}
          </text>
        ))}
        {marks.length === 2 && (
          <motion.line
            x1={marks[0].x}
            y1={marks[0].y}
            x2={marks[1].x}
            y2={marks[1].y}
            stroke="var(--color-ink)"
            strokeWidth="1.25"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            data-testid="track-leg"
          />
        )}
        {marks.map((m) => (
          <motion.g
            key={m.run}
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            style={{ transformOrigin: `${m.x}px ${m.y}px`, transformBox: "view-box" }}
            data-testid="fix-mark"
          >
            <polygon points={`${m.x},${m.y - 5} ${m.x + 5},${m.y + 4} ${m.x - 5},${m.y + 4}`} fill="var(--color-accent)" />
            <text x={m.x + 10} y={m.y + 4} fontSize="10" className="fill-ink font-mono">
              {m.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="mt-1 text-[11.5px] text-muted">{consoleCopy.trackCaption}</p>
    </div>
  );
}
