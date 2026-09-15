import { brand, footer } from "../content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Logo />
          <p className="text-[13px] text-muted-2">{brand.copyright}</p>
        </div>
        <nav aria-label="Footer" className="-mx-2.5 flex flex-wrap gap-y-1">
          {footer.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="navlink">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
