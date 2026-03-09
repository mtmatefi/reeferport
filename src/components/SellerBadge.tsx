import { type Seller } from "@/lib/data";

interface Props {
  seller: Seller;
  size?: "sm" | "md";
}

export default function SellerBadge({ seller, size = "md" }: Props) {
  const isSmall = size === "sm";

  return (
    <div className="flex items-center gap-3">
      <img
        src={seller.avatar}
        alt={seller.name}
        className={`rounded-full object-cover ring-1 ring-white/16 ${
          isSmall ? "h-8 w-8" : "h-10 w-10"
        }`}
      />
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-semibold tracking-[-0.02em] text-white/92 ${
              isSmall ? "text-[14px]" : "text-[15px]"
            }`}
          >
            {seller.name}
          </span>
          {seller.verified && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#60A5FA"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-white/40">
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              seller.type === "Händler"
                ? "bg-[rgba(96,165,250,0.12)] text-[#93C5FD]"
                : "bg-white/8 text-white/46"
            }`}
          >
            {seller.type}
          </span>
          <span>★ {seller.rating}</span>
          <span>({seller.reviewCount})</span>
          <span>·</span>
          <span>{seller.location}</span>
        </div>
      </div>
    </div>
  );
}
