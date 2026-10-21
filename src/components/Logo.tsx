import { brand } from "../content";
import { AutomatonMark } from "./AutomatonMark";

type Props = { className?: string; wordmark?: boolean };

/** Approved Automaton mark, plus the product name in Archivo 600. */
export function Logo({ className = "", wordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <AutomatonMark size={24} />
      {wordmark && (
        <span
          className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em]"
          style={{ fontVariationSettings: '"wdth" 96' }}
        >
          {brand.name}
        </span>
      )}
    </span>
  );
}
