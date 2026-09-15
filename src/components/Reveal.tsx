import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string; delay?: number };

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fades a block in once as it scrolls into view. Static and complete under reduced motion. */
export function Reveal({ children, className, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
