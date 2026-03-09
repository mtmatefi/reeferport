"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = ["Kategorie", "Details", "Preis & Ort", "Vorschau"] as const;

const CATS = [
  { label: "Korallen",   icon: "🪸", sub: "LPS, SPS, Weichkorallen, Zoanthus" },
  { label: "Fische",     icon: "🐠", sub: "Meerwasserfische aller Arten" },
  { label: "Wirbellose", icon: "🦞", sub: "Garnelen, Muscheln, Krabben, Schnecken" },
  { label: "Equipment",  icon: "💡", sub: "Pumpen, Leuchten, Filter, Technik" },
  { label: "Frags",      icon: "🪨", sub: "Ableger, Frags, kleine Kolonien" },
];

const CONDITIONS = ["Nachzucht", "Wildfang", "Neu", "Gebraucht"];

interface Form {
  category: string;
  title: string;
  latin: string;
  condition: string;
  description: string;
  price: string;
  currency: "CHF" | "EUR";
  location: string;
  shipping: boolean;
  shippingCost: string;
  pickup: boolean;
}

const EMPTY: Form = { category: "", title: "", latin: "", condition: "", description: "", price: "", currency: "CHF", location: "", shipping: false, shippingCost: "", pickup: true };

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30";
const INPUT = "w-full border border-white/10 bg-white/4 px-4 py-3 text-[15px] text-white/88 placeholder-white/24 focus:border-white/26 focus:outline-none transition";

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [published, setPublished] = useState(false);
  const router = useRouter();

  const set = (k: keyof Form, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k as keyof Form]; return n; });
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (step === 0 && !form.category) e.category = "Bitte Kategorie wählen";
    if (step === 1) {
      if (!form.title.trim()) e.title = "Titel ist erforderlich";
      if (!form.condition) e.condition = "Bitte Zustand wählen";
      if (!form.description.trim()) e.description = "Beschreibung ist erforderlich";
    }
    if (step === 2) {
      if (!form.price || Number(form.price) <= 0) e.price = "Bitte gültigen Preis eingeben";
      if (!form.location.trim()) e.location = "Standort ist erforderlich";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const publish = () => {
    setPublished(true);
    setTimeout(() => router.push("/"), 2000);
  };

  if (published) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 text-center scale-in">
        <div>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="mb-2 text-[26px] font-semibold tracking-[-0.05em]">Inserat veröffentlicht!</h2>
          <p className="text-[15px] text-white/44">Wird nach Prüfung freigeschaltet. Du wirst weitergeleitet…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-10">
      {/* Header + progress */}
      <div className="sticky top-0 z-10 glass border-b border-white/7 px-4 sm:px-6 lg:px-8 pb-4 pt-5">
        <div className="mb-4 flex items-center gap-3">
          {step > 0 ? (
            <button onClick={back} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ) : (
            <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          )}
          <h1 className="text-[17px] font-semibold tracking-[-0.03em]">Inserat erstellen</h1>
          <span className="ml-auto text-[12px] font-medium text-white/28">{step + 1} / {STEPS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-[2px] w-full rounded-full bg-white/7 overflow-hidden">
          <div className="h-full rounded-full bg-white/65 transition-all duration-400" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="mt-2.5 flex justify-between">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-[11px] font-medium ${i === step ? "text-white/70" : i < step ? "text-white/38" : "text-white/18"}`}>{s}</span>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-6 max-w-2xl">

        {/* ── Step 0: Category ─────────────────────────── */}
        {step === 0 && (
          <div className="fade-up">
            <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Was verkaufst du?</h2>
            <p className="mb-6 text-[14px] text-white/40">Wähle die passende Kategorie aus</p>
            {errors.category && <p className="mb-3 text-[13px] text-red-400">{errors.category}</p>}
            <div className="space-y-2">
              {CATS.map((c) => (
                <button key={c.label} onClick={() => set("category", c.label)}
                  className={`flex w-full items-center gap-4 border px-4 py-4 text-left transition-all duration-150 ${form.category === c.label ? "border-white/32 bg-white/7" : "border-white/8 hover:border-white/16 hover:bg-white/3"}`}>
                  <span className="text-[28px] leading-none shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-[15px] font-semibold">{c.label}</p>
                    <p className="mt-0.5 text-[12px] text-white/38">{c.sub}</p>
                  </div>
                  {form.category === c.label && (
                    <div className="ml-auto shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Details ──────────────────────────── */}
        {step === 1 && (
          <div className="fade-up space-y-5">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Beschreibe dein Inserat</h2>
              <p className="mb-6 text-[14px] text-white/40">Präzise Angaben = mehr Anfragen</p>
            </div>
            <div>
              <label className={FIELD_LABEL}>Titel *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder={`z.B. ${form.category === "Korallen" ? "Dragon Soul Torch Frag" : form.category === "Fische" ? "Mandarinfisch Paar" : "AI Hydra 64 HD LED"}`}
                className={INPUT + (errors.title ? " border-red-500/60" : "")} />
              {errors.title && <p className="mt-1 text-[12px] text-red-400">{errors.title}</p>}
            </div>
            {form.category !== "Equipment" && (
              <div>
                <label className={FIELD_LABEL}>Lateinischer Name</label>
                <input type="text" value={form.latin} onChange={(e) => set("latin", e.target.value)}
                  placeholder="z.B. Euphyllia glabrescens"
                  className={INPUT + " italic"} />
              </div>
            )}
            <div>
              <label className={FIELD_LABEL}>Zustand *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONDITIONS.map((c) => (
                  <button key={c} onClick={() => set("condition", c)}
                    className={`py-3 text-[13px] font-medium border transition ${form.condition === c ? "border-white/32 bg-white/8 text-white" : "border-white/8 text-white/40 hover:border-white/18"}`}>
                    {c}
                  </button>
                ))}
              </div>
              {errors.condition && <p className="mt-1 text-[12px] text-red-400">{errors.condition}</p>}
            </div>
            <div>
              <label className={FIELD_LABEL}>Beschreibung *</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5}
                placeholder="Grösse, Herkunft, Pflegeanforderungen, Parameter, besondere Merkmale…"
                className={INPUT + " resize-none leading-relaxed" + (errors.description ? " border-red-500/60" : "")} />
              <div className="mt-1 flex justify-between">
                {errors.description ? <p className="text-[12px] text-red-400">{errors.description}</p> : <span />}
                <span className="text-[11px] text-white/22">{form.description.length}/1000</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Price & Location ─────────────────── */}
        {step === 2 && (
          <div className="fade-up space-y-6">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Preis & Standort</h2>
              <p className="mb-6 text-[14px] text-white/40">Fast geschafft!</p>
            </div>

            {/* Photo upload UI */}
            <div>
              <label className={FIELD_LABEL}>Fotos (bis zu 8)</label>
              <div className="grid grid-cols-4 gap-2">
                {[0,1,2,3].map((i) => (
                  <div key={i} className={`aspect-square flex flex-col items-center justify-center border border-dashed transition ${i === 0 ? "border-white/18 hover:border-white/32 cursor-pointer" : "border-white/7"}`}>
                    {i === 0 ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/28">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <span className="mt-1.5 text-[10px] text-white/24">+ Foto</span>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-white/26">Tipp: Gute Fotos verdoppeln die Anzahl Anfragen</p>
            </div>

            {/* Price */}
            <div>
              <label className={FIELD_LABEL}>Preis *</label>
              <div className="flex gap-2">
                <select value={form.currency} onChange={(e) => set("currency", e.target.value as "CHF" | "EUR")}
                  className="border border-white/10 bg-white/4 px-3 py-3 text-[14px] text-white/60 focus:outline-none focus:border-white/22">
                  <option value="CHF">CHF</option>
                  <option value="EUR">EUR</option>
                </select>
                <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                  placeholder="0.–"
                  className={INPUT + " text-[20px] font-semibold tracking-[-0.04em]" + (errors.price ? " border-red-500/60" : "")} />
              </div>
              {errors.price && <p className="mt-1 text-[12px] text-red-400">{errors.price}</p>}
            </div>

            {/* Location */}
            <div>
              <label className={FIELD_LABEL}>Standort *</label>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
                placeholder="z.B. Luzern, Zug, Zürich…"
                className={INPUT + (errors.location ? " border-red-500/60" : "")} />
              {errors.location && <p className="mt-1 text-[12px] text-red-400">{errors.location}</p>}
            </div>

            {/* Delivery options */}
            <div>
              <label className={FIELD_LABEL}>Übergabe</label>
              <div className="space-y-2">
                {[
                  { key: "pickup" as const, label: "Selbstabholung", sub: "Käufer kommt zu dir" },
                  { key: "shipping" as const, label: "Versand möglich", sub: "Lebendversand Schweiz" },
                ].map((opt) => (
                  <button key={opt.key} onClick={() => set(opt.key, !form[opt.key])}
                    className={`flex w-full items-center justify-between px-4 py-3.5 border text-left transition ${form[opt.key] ? "border-white/28 bg-white/6" : "border-white/8 hover:border-white/16"}`}>
                    <div>
                      <p className="text-[14px] font-medium">{opt.label}</p>
                      <p className="text-[12px] text-white/34">{opt.sub}</p>
                    </div>
                    <div className={`h-5 w-5 shrink-0 border transition flex items-center justify-center ${form[opt.key] ? "border-white bg-white" : "border-white/22"}`}>
                      {form[opt.key] && <svg viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#03070A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </button>
                ))}
                {form.shipping && (
                  <input type="number" value={form.shippingCost} onChange={(e) => set("shippingCost", e.target.value)}
                    placeholder="Versandkosten in CHF"
                    className={INPUT + " mt-1"} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ──────────────────────────── */}
        {step === 3 && (
          <div className="fade-up">
            <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Vorschau</h2>
            <p className="mb-6 text-[14px] text-white/40">So sieht dein Inserat aus</p>

            <div className="border border-white/10 overflow-hidden">
              {/* Fake image placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#0A1520] to-[#060D13] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/14">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              </div>
              <div className="p-5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.category}</span>
                  {form.condition && <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.condition}</span>}
                </div>
                <h3 className="text-[22px] font-semibold tracking-[-0.04em]">{form.title || "Kein Titel"}</h3>
                {form.latin && <p className="mt-0.5 text-[13px] italic text-white/40">{form.latin}</p>}
                <p className="mt-3 text-[14px] leading-relaxed text-white/56">{form.description || "Keine Beschreibung"}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/7 pt-4">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.04em]">{form.currency} {form.price || "–"}</p>
                    <p className="text-[12px] text-white/34">{form.location || "Kein Standort"}</p>
                  </div>
                  <div className="text-right text-[12px] text-white/36">
                    {form.pickup && <p>Abholung möglich</p>}
                    {form.shipping && <p>Versand: CHF {form.shippingCost || "–"}</p>}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-white/34">
              Durch das Veröffentlichen stimmst du den{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-white/55">Nutzungsbedingungen</Link>{" "}
              zu. Inserate werden nach Überprüfung innerhalb von 24h freigeschaltet.
            </p>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-20 glass border-t border-white/7 px-4 sm:px-6 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] md:pb-3 md:left-[248px]">
        <div className="mx-auto flex max-w-2xl gap-3">
          <button
            onClick={step < STEPS.length - 1 ? next : publish}
            className="flex-1 bg-white py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/92 active:scale-[0.98] disabled:opacity-40"
            style={{ boxShadow: "0 6px 20px rgba(255,255,255,0.10)" }}
          >
            {step === STEPS.length - 1 ? "Jetzt veröffentlichen" : "Weiter"}
          </button>
        </div>
      </div>
    </div>
  );
}
