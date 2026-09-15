import { cta, links, pricing } from "../content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const dividers = [
  "",
  "border-t border-hairline md:border-t-0 md:border-l",
  "border-t border-hairline lg:border-t-0 lg:border-l",
  "border-t border-hairline md:border-l lg:border-t-0",
];

export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <Reveal>
        <p className="eyebrow">{pricing.eyebrow}</p>
        <h2 id="pricing-heading" className="display-2 mt-3 text-[clamp(1.875rem,3vw,2.5rem)]">
          {pricing.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.08} className="plate mt-10 overflow-hidden">
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {pricing.plans.map((p, i) => (
            <div key={p.name} className={`flex flex-col p-6 lg:p-7 ${dividers[i]} ${"addon" in p && p.addon ? "bg-panel-2" : ""}`}>
              <h3 className="text-[15px] font-medium">{p.name}</h3>
              <div className="readout mt-5 text-[2.125rem]">{p.price}</div>
              <div className="mt-2 text-[13px] text-muted-2">{pricing.perMonth}</div>
              <ul className="mt-6 space-y-1.5 text-[14.5px] text-ink">
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              {p.cta === "startFree" && (
                <a href={links.startFree} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 self-start lg:mt-auto lg:pt-0">
                  {cta.startFree}
                </a>
              )}
              {p.cta === "discord" && (
                <a href={links.discord} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8 self-start lg:mt-auto">
                  {cta.discord}
                </a>
              )}
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-6 text-[15px] text-muted-2">{pricing.pilot}</p>
      </Reveal>
    </Section>
  );
}
