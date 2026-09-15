import { sameTask } from "../content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

type ColumnData = typeof sameTask.without | typeof sameTask.withMemory;

function Column({ data }: { data: ColumnData }) {
  return (
    <div className="flex flex-col">
      <p className="font-mono text-[12px] text-muted">{sameTask.sourceLabel}</p>
      <h3 className="display-3 mt-2 text-[1.375rem]">{data.title}</h3>
      <dl className="mt-7 space-y-5">
        {data.rows.map((r) => (
          <div key={r.k} className="grid grid-cols-[5.5rem_1fr] gap-4">
            <dt className="pt-0.5 font-mono text-[12.5px] text-muted">{r.k}</dt>
            <dd className="text-[15.5px] leading-snug text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-baseline gap-3 pt-10">
        <span className="readout text-[clamp(3.5rem,5.5vw,5rem)]">{data.minutes}</span>
        <span className="text-[13px] text-muted-2">{data.minutesLabel}</span>
      </div>
    </div>
  );
}

export function SameTaskTwice() {
  return (
    <Section id="same-task" labelledBy="same-task-heading">
      <Reveal>
        <h2 id="same-task-heading" className="display-2 max-w-[22ch] text-[clamp(1.875rem,3vw,2.5rem)]">
          {sameTask.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.08} className="mt-12 grid gap-10 lg:grid-cols-[1fr_1px_1fr] lg:gap-16">
        <Column data={sameTask.without} />
        <div aria-hidden="true" className="hidden w-px self-stretch bg-hairline lg:block" />
        <div aria-hidden="true" className="h-px bg-hairline lg:hidden" />
        <Column data={sameTask.withMemory} />
      </Reveal>
      <Reveal className="mt-20 border-t border-hairline pt-10 lg:mt-24 lg:pt-12">
        <p className="display-2 max-w-[24ch] text-[clamp(1.75rem,3.4vw,3rem)]">{sameTask.display}</p>
        <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted-2">{sameTask.body}</p>
      </Reveal>
    </Section>
  );
}
