import { cta, hero, links } from "../content";
import { RunConsole } from "./console/RunConsole";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 pt-10 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-24">
        <div className="lg:col-span-5 lg:pt-4">
          <h1 id="hero-heading" className="display text-[clamp(2.625rem,6.4vw,4.25rem)]">
            {hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[36ch] text-[1.0625rem] leading-[1.55] text-muted-2 sm:text-[1.125rem]">{hero.subtext}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={links.startFree} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {cta.startFree}
            </a>
            <a href={links.whitepaper} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {cta.whitepaper}
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <RunConsole />
        </div>
      </div>
    </section>
  );
}
