import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { cta, links, nav } from "../content";
import { Logo } from "./Logo";

export function Nav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-bg">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" aria-label={nav.home} className="inline-flex min-h-[44px] items-center rounded-core">
          <Logo />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="navlink">
              {l.label}
            </a>
          ))}
          <a href={links.startFree} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm ml-3">
            {cta.startFree}
          </a>
        </nav>
        <button
          type="button"
          className="btn btn-ghost btn-icon md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? nav.menuClose : nav.menuOpen}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} weight="regular" aria-hidden="true" /> : <List size={20} weight="regular" aria-hidden="true" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id={menuId}
            aria-label="Primary"
            className="absolute inset-x-0 top-full border-b border-hairline bg-bg shadow-panel md:hidden"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mx-auto flex w-full max-w-[1280px] flex-col px-5 py-3 sm:px-8">
              {nav.links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="navlink min-h-12 text-base">
                  {l.label}
                </a>
              ))}
              <a
                href={links.startFree}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-3 mb-2 self-start"
              >
                {cta.startFree}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
