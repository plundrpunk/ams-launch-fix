import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { interfaces } from "../content";
import { useMediaQuery } from "../lib/useMediaQuery";
import { EASE_OUT, Reveal } from "./Reveal";
import { Section } from "./Section";

export function Interfaces() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const base = useId();
  const reduced = useReducedMotion();
  const vertical = useMediaQuery("(min-width: 768px)");
  const tabs = interfaces.tabs;
  const tab = tabs[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = tabs.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="interfaces" labelledBy="interfaces-heading">
      <Reveal>
        <h2 id="interfaces-heading" className="display-2 max-w-[22ch] text-[clamp(1.875rem,3vw,2.5rem)]">
          {interfaces.heading}
        </h2>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-2">{interfaces.body}</p>
      </Reveal>
      <Reveal delay={0.08} className="plate mt-12 overflow-hidden">
        <div className="grid md:grid-cols-[12rem_1fr]">
          <div
            role="tablist"
            aria-label={interfaces.tablistLabel}
            aria-orientation={vertical ? "vertical" : "horizontal"}
            className="flex border-b border-hairline md:flex-col md:border-r md:border-b-0 md:py-3"
          >
            {tabs.map((t, i) => {
              const selected = i === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${base}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${base}-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`relative min-h-[48px] px-5 text-left font-mono text-[13.5px] transition-colors md:min-h-[44px] ${
                    selected ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                  {selected && (
                    <motion.span
                      layoutId={`${base}-index`}
                      aria-hidden="true"
                      className="absolute right-4 bottom-[-1px] left-4 h-[2px] bg-accent md:top-3 md:right-auto md:bottom-3 md:left-0 md:h-auto md:w-[2px]"
                      transition={{ duration: reduced ? 0 : 0.25, ease: EASE_OUT }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={`${base}-panel-${tab.id}`}
            aria-labelledby={`${base}-tab-${tab.id}`}
            tabIndex={0}
            className="min-h-[240px] p-6 lg:p-8"
          >
            <motion.div
              key={tab.id}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <p className="text-[12.5px] text-muted">{tab.note}</p>
              <ul className={`mt-4 font-mono text-[13.5px] leading-[1.95] text-ink ${tab.lines.length > 6 ? "sm:columns-2 sm:gap-10" : ""}`}>
                {tab.lines.map((l) => (
                  <li key={l} className="break-inside-avoid whitespace-pre">
                    {l}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
