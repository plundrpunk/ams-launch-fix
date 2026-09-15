import { tiers } from "../content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

type Column = (typeof tiers.columns)[number];

const cell = (c: Column, row: string) => {
  switch (row) {
    case "Holds":
      return <span className="text-[15px] leading-snug">{c.holds}</span>;
    case "Retention":
      return (
        <span className="flex flex-col gap-1">
          <span className="text-[15px] leading-snug">{c.retention}</span>
          <span className="font-mono text-[12px] text-muted">{c.retentionMono}</span>
        </span>
      );
    case "Entity type":
      return <span className="font-mono text-[13.5px]">{c.entity}</span>;
    case "Path":
      return <span className="font-mono text-[13.5px]">{c.path}</span>;
    default:
      return <span className="font-mono text-[13.5px] text-muted-2">{c.example}</span>;
  }
};

export function MemoryTiers() {
  return (
    <Section id="memory" labelledBy="memory-heading">
      <Reveal>
        <h2 id="memory-heading" className="display-2 max-w-[22ch] text-[clamp(1.875rem,3vw,2.5rem)]">
          {tiers.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.08} className="mt-12">
        {/* Desktop plate: one table, three unequal columns (5/4/3), grouped rows. */}
        <div className="plate hidden overflow-hidden lg:block">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "9rem" }} />
              <col style={{ width: "41.6%" }} />
              <col style={{ width: "33.3%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="px-6 pt-6 pb-5 text-left align-bottom font-mono text-[12px] font-normal text-muted">
                  memory_tier
                </th>
                {tiers.columns.map((c) => (
                  <th key={c.name} scope="col" className="border-l border-hairline-soft px-6 pt-6 pb-5 text-left align-bottom">
                    <span className="display-3 block text-[1.375rem]">{c.name}</span>
                    <span className="mt-1 block font-mono text-[12px] font-normal text-muted">{`"${c.tier}"`}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.rows.map((row, i) => (
                <tr key={row} className={i === tiers.rows.length - 1 ? "bg-panel-2" : ""}>
                  <th scope="row" className="border-t border-hairline-soft px-6 py-5 text-left align-top text-[13px] font-medium text-muted-2">
                    {row}
                  </th>
                  {tiers.columns.map((c) => (
                    <td key={c.name} className="border-t border-l border-hairline-soft px-6 py-5 align-top">
                      {cell(c, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Below lg: one stacked block per tier. */}
        <div className="grid gap-4 lg:hidden">
          {tiers.columns.map((c) => (
            <div key={c.name} className="plate overflow-hidden">
              <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                <h3 className="display-3 text-[1.25rem]">{c.name}</h3>
                <span className="font-mono text-[12px] text-muted">{`"${c.tier}"`}</span>
              </div>
              <dl>
                {tiers.rows.map((row, i) => (
                  <div
                    key={row}
                    className={`grid grid-cols-[6rem_1fr] gap-4 border-t border-hairline-soft px-5 py-3.5 ${i === tiers.rows.length - 1 ? "bg-panel-2" : ""}`}
                  >
                    <dt className="text-[13px] font-medium text-muted-2">{row}</dt>
                    <dd className="min-w-0 break-words">{cell(c, row)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-muted-2">{tiers.footnote}</p>
      </Reveal>
    </Section>
  );
}
