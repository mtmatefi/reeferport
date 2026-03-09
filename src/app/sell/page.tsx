"use client";
import { useState } from "react";
import Link from "next/link";

const steps = ["Kategorie", "Details", "Fotos & Preis", "Vorschau"];

const categoryOptions = [
  { label: "Korallen", icon: "🪸", sub: "LPS, SPS, Weichkorallen, Zoanthus" },
  { label: "Fische", icon: "🐠", sub: "Meerwasserfische aller Arten" },
  { label: "Wirbellose", icon: "🦞", sub: "Garnelen, Krabben, Muscheln, Schnecken" },
  { label: "Equipment", icon: "💡", sub: "Pumpen, Leuchten, Filter, Technik" },
  { label: "Frags", icon: "🪨", sub: "Ableger, Frags, kleine Kolonien" },
];

const conditionOptions = ["Nachzucht", "Wildfang", "Neu", "Gebraucht"];

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    latin: "",
    condition: "",
    description: "",
    price: "",
    currency: "CHF",
    location: "",
    shipping: false,
    shippingCost: "",
    pickup: true,
  });

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/8 bg-[rgba(3,7,10,0.94)] px-5 pb-4 pt-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="text-[18px] font-semibold tracking-[-0.04em]">Inserat erstellen</h1>
          <span className="ml-auto text-[13px] text-white/36">
            {step + 1} / {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-white/70 transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step labels */}
        <div className="mt-3 flex justify-between">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              className={`text-[11px] font-medium transition-colors ${
                i === step
                  ? "text-white"
                  : i < step
                  ? "text-white/50"
                  : "text-white/22"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-6">
        {/* Step 0: Category */}
        {step === 0 && (
          <div className="fade-in-up">
            <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Was verkaufst du?</h2>
            <p className="mb-6 text-[14px] text-white/46">Wähle die passende Kategorie</p>
            <div className="space-y-2.5">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={[
                    "flex w-full items-center gap-4 border px-4 py-4 text-left transition-all duration-200",
                    category === cat.label
                      ? "border-white/40 bg-white/6"
                      : "border-white/8 bg-white/2 hover:border-white/16",
                  ].join(" ")}
                >
                  <span className="text-[28px] leading-none">{cat.icon}</span>
                  <div>
                    <div className="text-[15px] font-semibold">{cat.label}</div>
                    <div className="mt-0.5 text-[12px] text-white/42">{cat.sub}</div>
                  </div>
                  {category === cat.label && (
                    <div className="ml-auto">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="fade-in-up space-y-5">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Details</h2>
              <p className="mb-6 text-[14px] text-white/46">Beschreibe dein Inserat genau</p>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Titel *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="z.B. Dragon Soul Torch Frag"
                className="w-full border border-white/10 bg-white/4 px-4 py-3.5 text-[15px] text-white/86 placeholder-white/26 focus:border-white/28 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Lateinischer Name
              </label>
              <input
                type="text"
                value={form.latin}
                onChange={(e) => setForm((f) => ({ ...f, latin: e.target.value }))}
                placeholder="z.B. Euphyllia glabrescens"
                className="w-full border border-white/10 bg-white/4 px-4 py-3.5 text-[15px] italic text-white/86 placeholder-white/26 focus:border-white/28 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Zustand *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {conditionOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((f) => ({ ...f, condition: c }))}
                    className={[
                      "border py-3 text-[14px] font-medium transition-all",
                      form.condition === c
                        ? "border-white/40 bg-white/8 text-white"
                        : "border-white/8 text-white/44 hover:border-white/16",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Beschreibung *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={5}
                placeholder="Beschreibe Grösse, Herkunft, Pflegeanforderungen, besondere Merkmale..."
                className="w-full resize-none border border-white/10 bg-white/4 px-4 py-3.5 text-[14px] text-white/86 placeholder-white/26 leading-relaxed focus:border-white/28 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Photos & Price */}
        {step === 2 && (
          <div className="fade-in-up space-y-6">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Fotos & Preis</h2>
              <p className="mb-6 text-[14px] text-white/46">Gute Fotos erhöhen die Verkaufschance</p>
            </div>

            {/* Photo upload */}
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Fotos (max. 8)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button className="flex h-24 flex-col items-center justify-center gap-2 border border-dashed border-white/20 bg-white/3 transition hover:border-white/36">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.36)" strokeWidth="1.6" />
                    <circle cx="8.5" cy="8.5" r="1.5" stroke="rgba(255,255,255,0.36)" strokeWidth="1.4" />
                    <path d="M21 15L16 10L5 21" stroke="rgba(255,255,255,0.36)" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] text-white/30">+ Foto</span>
                </button>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Preis *
              </label>
              <div className="flex gap-2">
                <select
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                  className="border border-white/10 bg-white/4 px-3 py-3.5 text-[14px] text-white/70 focus:outline-none"
                >
                  <option value="CHF">CHF</option>
                  <option value="EUR">EUR</option>
                </select>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0"
                  className="flex-1 border border-white/10 bg-white/4 px-4 py-3.5 text-[18px] font-semibold tracking-[-0.03em] text-white/86 placeholder-white/26 focus:border-white/28 focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Standort *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="z.B. Luzern"
                className="w-full border border-white/10 bg-white/4 px-4 py-3.5 text-[15px] text-white/86 placeholder-white/26 focus:border-white/28 focus:outline-none"
              />
            </div>

            {/* Delivery */}
            <div>
              <label className="mb-2 block text-[12px] font-medium uppercase tracking-[0.16em] text-white/36">
                Übergabe
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setForm((f) => ({ ...f, pickup: !f.pickup }))}
                  className={`flex w-full items-center justify-between border px-4 py-3.5 text-left transition ${
                    form.pickup ? "border-white/28 bg-white/6" : "border-white/8"
                  }`}
                >
                  <span className="text-[14px]">Selbstabholung</span>
                  <div className={`h-5 w-5 border ${form.pickup ? "border-white bg-white" : "border-white/24"}`}>
                    {form.pickup && (
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M5 10L8 13L15 7" stroke="#03070A" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setForm((f) => ({ ...f, shipping: !f.shipping }))}
                  className={`flex w-full items-center justify-between border px-4 py-3.5 text-left transition ${
                    form.shipping ? "border-white/28 bg-white/6" : "border-white/8"
                  }`}
                >
                  <span className="text-[14px]">Versand möglich</span>
                  <div className={`h-5 w-5 border ${form.shipping ? "border-white bg-white" : "border-white/24"}`}>
                    {form.shipping && (
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M5 10L8 13L15 7" stroke="#03070A" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                </button>
                {form.shipping && (
                  <input
                    type="number"
                    value={form.shippingCost}
                    onChange={(e) => setForm((f) => ({ ...f, shippingCost: e.target.value }))}
                    placeholder="Versandkosten in CHF"
                    className="w-full border border-white/10 bg-white/4 px-4 py-3 text-[14px] text-white/86 placeholder-white/26 focus:border-white/28 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="fade-in-up">
            <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Vorschau</h2>
            <p className="mb-6 text-[14px] text-white/46">So sieht dein Inserat aus</p>

            <div className="border border-white/10 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/46">{category}</span>
                <span className="rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-white/46">{form.condition}</span>
              </div>
              <h3 className="text-[22px] font-semibold tracking-[-0.04em]">
                {form.title || "Kein Titel"}
              </h3>
              {form.latin && (
                <p className="mt-0.5 text-[13px] italic text-white/46">{form.latin}</p>
              )}
              <p className="mt-3 text-[14px] leading-relaxed text-white/60">
                {form.description || "Keine Beschreibung"}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-4">
                <div>
                  <div className="text-[22px] font-semibold tracking-[-0.04em]">
                    {form.currency} {form.price || "–"}
                  </div>
                  <div className="text-[12px] text-white/36">{form.location || "Kein Standort"}</div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-white/42">
              Durch das Veröffentlichen stimmst du den Nutzungsbedingungen zu. Inserate werden nach Überprüfung innerhalb von 24h freigeschaltet.
            </p>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[rgba(3,7,10,0.95)] px-5 py-4 pb-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-sm gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex h-[50px] w-[50px] items-center justify-center border border-white/12 transition hover:border-white/28"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep((s) => s + 1);
            }}
            disabled={step === 0 && !category}
            className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black shadow-[0_12px_28px_rgba(255,255,255,0.12)] transition hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40"
          >
            {step === steps.length - 1 ? "Jetzt veröffentlichen" : "Weiter"}
          </button>
        </div>
      </div>
    </div>
  );
}
