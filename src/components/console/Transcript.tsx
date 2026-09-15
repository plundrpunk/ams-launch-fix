import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { consoleCopy, RESULT_SEPARATOR } from "../../content";
import type { RunIndex, TranscriptLine } from "./machine";

const TOOL_CALL = /^([a-z_]+)(\(.*)$/;

function splitResult(text: string): [string, string | null] {
  const i = text.indexOf(RESULT_SEPARATOR);
  return i === -1 ? [text, null] : [text.slice(0, i), text.slice(i + RESULT_SEPARATOR.length)];
}

function Call({ text }: { text: string }) {
  const m = TOOL_CALL.exec(text);
  if (!m) return <span className="text-ink">{text}</span>;
  return (
    <span className="text-ink">
      <span className="font-medium">{m[1]}</span>
      {m[2]}
    </span>
  );
}

type LineProps = { line: TranscriptLine; active: boolean; reduced: boolean };

function Line({ line, active, reduced }: LineProps) {
  const anim = reduced
    ? {}
    : { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.22, ease: "easeOut" as const } };

  if (line.kind === "divider") {
    return (
      <motion.li {...anim} className="flex items-center gap-3 pt-4 pb-1.5 text-[11.5px] text-muted first:pt-0" data-kind="divider">
        <span>{line.label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
      </motion.li>
    );
  }
  if (line.kind === "complete") {
    return (
      <motion.li {...anim} className="grid grid-cols-[3.25rem_1fr] gap-x-3 pt-1.5" data-kind="complete" data-testid="complete-line">
        <span aria-hidden="true" />
        <span className="font-medium text-ink">{line.text}</span>
      </motion.li>
    );
  }
  const [call, result] = splitResult(line.text);
  return (
    <motion.li {...anim} className="relative grid grid-cols-[3.25rem_1fr] gap-x-3" data-kind="line" data-testid="transcript-line">
      {active && <span aria-hidden="true" className="absolute top-[0.3em] -left-4 h-[1.15em] w-[2px] bg-accent sm:-left-5" />}
      <span className="tabular-nums text-muted">{line.t}</span>
      <span className="min-w-0 break-words">
        <Call text={call} />
        {result !== null && (
          <>
            <ArrowRight size={12} weight="regular" className="mx-1.5 inline-block align-[-0.1em] text-muted" role="img" aria-label="to" />
            <span className="text-muted-2">{result}</span>
          </>
        )}
        {active && <span aria-hidden="true" className="cursor-block" />}
      </span>
    </motion.li>
  );
}

type Props = { lines: TranscriptLine[]; running: RunIndex | null; hydrated: boolean };

export function Transcript({ lines, running, hydrated }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [lines.length, reduced]);

  const lastId = lines.length ? lines[lines.length - 1].id : null;

  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-label={consoleCopy.transcript}
      data-testid="transcript"
      className="scroll-quiet h-[300px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-[1.6] sm:px-5 md:h-[484px]"
    >
      {lines.length === 0 ? (
        hydrated && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-muted">
              <polygon points="12,2.4 20.4,7.2 20.4,16.8 12,21.6 3.6,16.8 3.6,7.2" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 max-w-[30ch] text-muted-2" data-testid="empty">
              {consoleCopy.empty}
            </p>
          </div>
        )
      ) : (
        <ol className="space-y-[3px]">
          {lines.map((line) => (
            <Line key={line.id} line={line} active={running !== null && line.id === lastId} reduced={reduced} />
          ))}
        </ol>
      )}
    </div>
  );
}
