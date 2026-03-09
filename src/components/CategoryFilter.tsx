"use client";
import { type Category, categories } from "@/lib/data";

interface Props {
  active: Category | "Alle";
  onChange: (cat: Category | "Alle") => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {categories.map((c) => {
        const isActive = c.label === active;
        return (
          <button
            key={c.label}
            onClick={() => onChange(c.label)}
            className={[
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-200 active:scale-95",
              isActive
                ? "border-white/28 bg-white/9 text-white"
                : "border-white/7 text-white/40 hover:border-white/16 hover:text-white/70",
            ].join(" ")}
          >
            <span className="text-[13px] leading-none">{c.icon}</span>
            <span>{c.label}</span>
            {c.count > 0 && (
              <span className={`text-[10px] tabular-nums ${isActive ? "text-white/55" : "text-white/24"}`}>
                {c.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
