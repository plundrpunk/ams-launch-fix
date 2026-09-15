import { evidence } from "../content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

type ReadoutProps = { value: string; sub?: string; label: string; name?: string; size?: "lg" | "md" };

function Readout({ value, sub, label, name, size = "lg" }: ReadoutProps) {
  return (
    <div className="min-w-0">
      <div className={`readout text-ink ${size === "lg" ? "text-[clamp(2rem,3vw,2.5rem)]" : "text-[clamp(1.75rem,2.4vw,2.125rem)]"}`}>{value}</div>
      {sub && <div className="mt-2 font-mono text-[12.5px] tabular-nums text-muted">{sub}</div>}
      <div className="mt-1.5 text-[13px] leading-snug text-muted-2">{label}</div>
      {name && <div className="mt-1 truncate font-mono text-[12.5px] text-ink">{name}</div>}
    </div>
  );
}

export function Evidence() {
  return (
    <Section id="evidence" labelledBy="evidence-heading">
      <Reveal>
        <h2 id="evidence-heading" className="display-2 max-w-[22ch] text-[clamp(1.875rem,3vw,2.5rem)]">
          {evidence.heading}
        </h2>
        <p className="display-3 mt-5 max-w-[34ch] text-[clamp(1.125rem,1.6vw,1.375rem)] text-ink">{evidence.framing}</p>
      </Reveal>
      <Reveal delay={0.08} className="plate mt-12 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1px_1fr]">
          <div className="p-6 lg:p-8">
            <p className="max-w-[60ch] text-[13px] leading-snug text-muted-2">{evidence.benchmarkLabel}</p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              {evidence.readouts.map((r) => (
                <Readout key={r.label} value={r.value} sub={r.sub} label={r.label} />
              ))}
            </div>
            <p className="mt-8 max-w-[60ch] text-[13px] leading-snug text-muted-2">{evidence.benchmarkNote}</p>
          </div>
          <div aria-hidden="true" className="hidden bg-hairline lg:block" />
          <div aria-hidden="true" className="h-px bg-hairline lg:hidden" />
          <div className="p-6 lg:p-8">
            <p className="max-w-[60ch] text-[13px] leading-snug text-muted-2">{evidence.safetyLabel}</p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              {evidence.safety.map((r) => (
                <Readout key={r.label} value={r.value} sub={r.sub} label={r.label} />
              ))}
            </div>
            <p className="mt-8 max-w-[60ch] text-[13px] leading-snug text-muted-2">{evidence.safetyNote}</p>
          </div>
        </div>
        <div className="grid gap-2 border-t border-hairline px-6 py-4 sm:grid-cols-2 lg:px-8">
          {evidence.caveats.map((c) => (
            <p key={c} className="text-[13px] leading-snug text-muted-2">
              {c}
            </p>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.12} className="plate-flat mt-4">
        <div className="grid items-end gap-8 px-6 py-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8 lg:py-7">
          <p className="max-w-[28ch] text-[13px] leading-snug text-muted-2 sm:col-span-2 lg:col-span-1">{evidence.liveLabel}</p>
          {evidence.live.map((r) => (
            <Readout key={r.label} value={r.value} label={r.label} name={r.name || undefined} size="md" />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
