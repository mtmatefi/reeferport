import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

/** Coral-branch-in-circle SVG logo matching the Gesellschaftsbecken brand */
export function CoralIcon({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer teal circle arc */}
      <ellipse cx="50" cy="52" rx="40" ry="38" stroke="#2DD4BF" strokeWidth="2.5" fill="none" strokeLinecap="round"
        strokeDasharray="180 60" strokeDashoffset="-10" />

      {/* Water base line */}
      <path d="M22 72 Q36 68 50 72 Q64 76 78 72" stroke="#2DD4BF" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Main coral trunk */}
      <path d="M50 72 L50 52" stroke="#E07B5A" strokeWidth="3.5" strokeLinecap="round" />

      {/* Left main branch */}
      <path d="M50 58 L38 44" stroke="#E07B5A" strokeWidth="3" strokeLinecap="round" />
      {/* Left sub-branches */}
      <path d="M38 44 L30 36" stroke="#E07B5A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M38 44 L42 34" stroke="#E07B5A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 36 L26 28" stroke="#E07B5A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 36 L34 28" stroke="#E07B5A" strokeWidth="1.6" strokeLinecap="round" />

      {/* Right main branch */}
      <path d="M50 58 L62 44" stroke="#E07B5A" strokeWidth="3" strokeLinecap="round" />
      {/* Right sub-branches */}
      <path d="M62 44 L70 36" stroke="#E07B5A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M62 44 L58 34" stroke="#E07B5A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M70 36 L74 28" stroke="#E07B5A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M70 36 L66 28" stroke="#E07B5A" strokeWidth="1.6" strokeLinecap="round" />

      {/* Center top branch */}
      <path d="M50 52 L50 38" stroke="#E07B5A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 42 L44 32" stroke="#E07B5A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M50 42 L56 32" stroke="#E07B5A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M50 38 L50 28" stroke="#E07B5A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Teal base / roots */}
      <path d="M50 72 L46 80" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M50 72 L54 80" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M50 72 L50 82" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

interface BrandProps {
  iconSize?: number;
  showTagline?: boolean;
  compact?: boolean;
}

export default function Brand({ iconSize = 32, showTagline = false, compact = false }: BrandProps) {
  return (
    <div className="flex items-center gap-2.5">
      <CoralIcon size={iconSize} />
      <div>
        <span
          className={[
            "font-semibold tracking-[-0.04em] text-white leading-none block",
            compact ? "text-[15px]" : "text-[20px]",
          ].join(" ")}
        >
          Gesellschaftsbecken
        </span>
        {showTagline && (
          <span className="block text-[10px] font-medium text-white/30 tracking-[0.08em]">
            Meerwasser Marktplatz Schweiz
          </span>
        )}
      </div>
    </div>
  );
}
