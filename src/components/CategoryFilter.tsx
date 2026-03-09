"use client";
import { type Category } from "@/lib/data";
import { categories } from "@/lib/data";

interface Props {
  active: Category | "Alle";
  onChange: (cat: Category | "Alle") => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {categories.map((cat) => {
        const isActive = cat.label === active;
        return (
          <button
            key={cat.label}
            onClick={() => onChange(cat.label)}
            className={[
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
              isActive
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/8 bg-white/4 text-white/44 hover:border-white/16 hover:text-white/70",
            ].join(" ")}
          >
            <span className="text-[14px] leading-none">{cat.icon}</span>
            <span>{cat.label}</span>
            {cat.count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-white/6 text-white/36"
                }`}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
