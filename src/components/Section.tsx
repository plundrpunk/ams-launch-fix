import type { ReactNode } from "react";

type Props = { id: string; labelledBy: string; children: ReactNode; className?: string };

export function Section({ id, labelledBy, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`border-t border-hairline ${className}`}>
      <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-8 lg:py-28">{children}</div>
    </section>
  );
}
