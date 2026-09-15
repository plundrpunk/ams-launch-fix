import { brand } from "../content";

type Props = { className?: string; wordmark?: boolean };

/** Hexagon outline with a vermilion index mark, plus the wordmark in Archivo 600. */
export function Logo({ className = "", wordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <polygon
          points="12,2.4 20.4,7.2 20.4,16.8 12,21.6 3.6,16.8 3.6,7.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="11.25" y="0.9" width="1.5" height="4.6" fill="#c8401f" />
      </svg>
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
