import { useState } from "react";
import { closing, cta, links } from "../content";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Closing() {
  const [imageOk, setImageOk] = useState(true);
  const src = `${import.meta.env.BASE_URL}img/fix-dial.webp`;
  return (
    <Section id="closing" labelledBy="closing-heading">
      <Reveal className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <h2 id="closing-heading" className="display text-[clamp(2.25rem,4.6vw,3.75rem)]">
            {closing.heading}
          </h2>
          <p className="mt-5 max-w-[40ch] text-[1.125rem] leading-relaxed text-muted-2">{closing.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={links.startFree} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {cta.startFree}
            </a>
            <a href={links.whitepaper} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {cta.whitepaper}
            </a>
          </div>
        </div>
        {imageOk && (
          <figure className="aspect-[4/3] w-full max-w-full overflow-hidden rounded-panel border border-hairline bg-panel-2 shadow-panel lg:col-span-5 lg:col-start-8">
            <img
              src={src}
              alt={closing.imageAlt}
              width={1200}
              height={896}
              decoding="async"
              className="h-full w-full object-cover"
              onError={() => setImageOk(false)}
            />
          </figure>
        )}
      </Reveal>
    </Section>
  );
}
