import { Check } from "@phosphor-icons/react";
import { retrieval } from "../content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

function ProvenanceGraph() {
  const nodes = retrieval.provenance.nodes.map((label, i) => ({ label, x: 40 + i * 80, y: i % 2 === 0 ? 26 : 44 }));
  return (
    <svg viewBox="0 0 320 84" className="mt-auto w-full max-w-[360px] h-auto pt-6" role="img" aria-label={`Four linked memory nodes: ${retrieval.provenance.nodes.join(", ")}.`}>
      {nodes.slice(1).map((n, i) => (
        <line key={n.label} x1={nodes[i].x} y1={nodes[i].y} x2={n.x} y2={n.y} stroke="var(--color-ink)" strokeWidth="1" strokeOpacity="0.55" />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="6" fill="var(--color-panel)" stroke="var(--color-ink)" strokeWidth="1.25" />
          <text x={n.x} y={72} textAnchor="middle" fontSize="10.5" className="fill-muted-2 font-mono">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Retrieval() {
  const base = import.meta.env.BASE_URL;
  return (
    <Section id="retrieval" labelledBy="retrieval-heading">
      <Reveal>
        <h2 id="retrieval-heading" className="display-2 max-w-[24ch] text-[clamp(1.875rem,3vw,2.5rem)]">
          {retrieval.heading}
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-3 md:grid-cols-12">
        {/* a. Hybrid retrieval, 7 columns */}
        <Reveal className="plate flex flex-col p-6 md:col-span-7 lg:p-8">
          <h3 className="display-3 text-[1.25rem]">{retrieval.hybrid.title}</h3>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-2">{retrieval.hybrid.body}</p>
          <p className="mt-auto pt-7 text-[12px] text-muted">{retrieval.hybrid.resultsLabel}</p>
          <ol className="mt-3 font-mono text-[13px]">
            {retrieval.hybrid.results.map((r, i) => (
              <li
                key={r.score}
                className={`grid grid-cols-[1.25rem_3.5rem_1fr] items-baseline gap-3 py-2.5 sm:grid-cols-[1.25rem_3.5rem_6rem_1fr] ${i > 0 ? "border-t border-hairline-soft" : ""}`}
              >
                <span className="text-muted">{i + 1}</span>
                <span className="font-medium tabular-nums text-ink">{r.score}</span>
                <span className="hidden text-muted sm:block">{r.tier}</span>
                <span className="min-w-0 truncate text-ink">{r.title}</span>
              </li>
            ))}
          </ol>
        </Reveal>
        {/* b. Admission control, 5 columns, tinted */}
        <Reveal delay={0.06} className="plate bg-panel-2 p-6 md:col-span-5 lg:p-8">
          <h3 className="display-3 text-[1.25rem]">{retrieval.admission.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-2">{retrieval.admission.body}</p>
          <ul className="mt-6 font-mono text-[13px]">
            {retrieval.admission.checks.map((c) => (
              <li key={c} className="flex items-center gap-3 py-[7px]">
                <Check size={14} weight="regular" className="shrink-0 text-ink" aria-hidden="true" />
                <span className="flex-1 text-ink">{c}</span>
                <span className="text-muted-2">{retrieval.admission.pass}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        {/* c. Provenance graph, 5 columns */}
        <Reveal delay={0.12} className="plate flex flex-col p-6 md:col-span-5 lg:p-8">
          <h3 className="display-3 text-[1.25rem]">{retrieval.provenance.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-2">{retrieval.provenance.body}</p>
          <ProvenanceGraph />
        </Reveal>
        {/* d. Real dashboard screenshot in a double bezel, 7 columns */}
        <Reveal delay={0.18} className="plate p-3 md:col-span-7">
          <figure className="flex h-full flex-col">
            <div className="rounded-core border border-hairline bg-panel-2 p-1.5">
              <img
                src={`${base}img/smart-actions-scoreboard.webp`}
                alt={retrieval.scoreboard.alt}
                width={1600}
                height={798}
                decoding="async"
                className="h-auto w-full rounded-[4px] border border-hairline-soft"
              />
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-2 pt-3 pb-1 text-[12.5px]">
              <span className="text-ink">{retrieval.scoreboard.title}</span>
              <span className="text-muted">{retrieval.scoreboard.caption}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
