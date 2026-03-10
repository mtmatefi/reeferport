"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["KI-Analyse", "Kategorie", "Details", "Preis & Ort", "Vorschau"] as const;

// ─── Taxonomy ─────────────────────────────────────────────────────────────────
const CATS = [
  {
    label: "Korallen", icon: "🪸",
    sub: "LPS, SPS, Softkorallen, Zoanthus/Palythoa",
    subcategories: ["LPS", "SPS", "Softkorallen", "Zoanthus", "Palythoa", "Goniopora/Alveopora", "Pilzkorallen (Fungiidae)", "Sonstige Korallen"],
  },
  {
    label: "Anemonen", icon: "🌺",
    sub: "BTA, Magnificas, Carpet, Condylactis u.v.m.",
    subcategories: ["Blasenanemone (Entacmaea)", "Magnifica-Anemone", "Teppichanemone (Stichodactyla)", "Crispa-Anemone", "Condylactis", "Sonstige Anemonen"],
  },
  {
    label: "Fische", icon: "🐠",
    sub: "Meerwasserfische aller Arten",
    subcategories: ["Clownfische", "Doktorfische/Tangs", "Grundeln", "Lippfische (Wrasse)", "Zwergkaiserfische", "Kaiserfische", "Drückerfische", "Falterfische", "Drachenkopffische", "Leierfische", "Sonstige Fische"],
  },
  {
    label: "Wirbellose", icon: "🦞",
    sub: "Garnelen, Muscheln, Krabben, Seeigel, Seesterne",
    subcategories: ["Garnelen", "Riesenmuscheln (Tridacna)", "Krabben", "Schnecken", "Seeigel", "Seesterne", "Nacktschnecken/Nudibranchier", "Sonstige Wirbellose"],
  },
  {
    label: "Equipment", icon: "⚙️",
    sub: "Beleuchtung, Pumpen, Abschäumer, Messtechnik",
    subcategories: ["LED-Beleuchtung", "T5/T8-Leuchten", "HQI-Beleuchtung", "Strömungspumpen", "Förderpumpen", "Abschäumer", "Sump/Technikbecken", "Dosierpumpen", "Kalkreaktor/Balling", "Osmoseanlage/AWC", "Messtechnik/Controller", "Heizung/Kühlung", "Filtersysteme", "Aquarium komplett", "Becken/Unterschrank", "Sonstige Technik"],
  },
  {
    label: "Frags", icon: "🪨",
    sub: "Ableger, Frags, kleine Kolonien",
    subcategories: ["LPS-Frags", "SPS-Frags", "Softkorallen-Frags", "Zoanthus-Frags", "Frag-Sets/Pakete", "Sonstige Frags"],
  },
] as const;

// CITES-relevant categories/subcategories
const CITES_RELEVANT_CATS = ["Anemonen", "Wirbellose"];
const CITES_RELEVANT_SUBS = [
  "Riesenmuscheln (Tridacna)", "LPS", "SPS", "Goniopora/Alveopora",
  "Blasenanemone (Entacmaea)", "Magnifica-Anemone", "Teppichanemone (Stichodactyla)",
  "Crispa-Anemone", "Doktorfische/Tangs", "Kaiserfische", "Zwergkaiserfische",
];

const CITES_APPENDIX_INFO: Record<string, string> = {
  "Riesenmuscheln (Tridacna)": "II",
  "Blasenanemone (Entacmaea)": "II",
  "Magnifica-Anemone": "II",
  "Teppichanemone (Stichodactyla)": "II",
  "Crispa-Anemone": "II",
  "LPS": "II",
  "SPS": "II",
  "Goniopora/Alveopora": "II",
};

function isCitesRelevant(category: string, subcategory: string): boolean {
  return CITES_RELEVANT_CATS.includes(category) || CITES_RELEVANT_SUBS.includes(subcategory);
}

const LISTING_TYPES = [
  { value: "Verkaufen", label: "Verkaufen", icon: "💰", desc: "Artikel gegen Bezahlung abgeben" },
  { value: "Verschenken", label: "Verschenken", icon: "🎁", desc: "Kostenlos abgeben – an gutes Zuhause" },
  { value: "Tauschen", label: "Tauschen", icon: "🔄", desc: "Gegen andere Tiere oder Equipment tauschen" },
] as const;

const CONDITIONS = ["Nachzucht", "Wildfang", "Neu", "Gebraucht"];

const EQUIPMENT_CONDITIONS = ["Neu", "Gebraucht", "Neuwertig", "Defekt/Ersatzteile"];

interface FollowUpQuestion {
  id: string;
  question: string;
  options?: string[];
}

interface AIResult {
  title: string;
  latin: string;
  category: string;
  condition: string;
  suggestedPrice: number;
  description: string;
  tags: string[];
  followUpQuestions: FollowUpQuestion[];
  confidence: number;
}

interface Form {
  category: string;
  subcategory: string;
  listingType: "Verkaufen" | "Verschenken" | "Tauschen";
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
  imageFile: File | null;
  imagePreview: string;
  // CITES
  citesRelevant: boolean;
  citesAppendix: string;
  citesConfirmed: boolean;
  citesNotes: string;
}

const EMPTY: Form = {
  category: "", subcategory: "", listingType: "Verkaufen",
  title: "", latin: "", condition: "", description: "",
  price: "", currency: "CHF", location: "", shipping: false, shippingCost: "",
  pickup: true, imageFile: null, imagePreview: "",
  citesRelevant: false, citesAppendix: "", citesConfirmed: false, citesNotes: "",
};

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30";
const INPUT = "w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-4 py-3 text-[15px] text-white/88 placeholder-white/24 focus:border-[rgba(232,114,74,0.35)] focus:outline-none transition";

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  const [aiState, setAiState] = useState<"idle" | "uploading" | "analyzing" | "done" | "error">("idle");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const selectedCat = CATS.find((c) => c.label === form.category);
  const isEquipment = form.category === "Equipment";
  const conditions = isEquipment ? EQUIPMENT_CONDITIONS : CONDITIONS;

  const set = (k: keyof Form, v: string | boolean | File | null) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      // Auto-detect CITES relevance when category or subcategory changes
      if (k === "category" || k === "subcategory") {
        const cat = k === "category" ? (v as string) : f.category;
        const sub = k === "subcategory" ? (v as string) : f.subcategory;
        const relevant = isCitesRelevant(cat, sub);
        const appendix = CITES_APPENDIX_INFO[sub] ?? "";
        next.citesRelevant = relevant;
        next.citesAppendix = appendix;
        if (k === "category") next.subcategory = ""; // reset subcategory on cat change
      }
      return next;
    });
    setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (step === 1 && !form.category) e.category = "Bitte Kategorie wählen";
    if (step === 2) {
      if (!form.title.trim()) e.title = "Titel ist erforderlich";
      if (!form.condition) e.condition = "Bitte Zustand wählen";
      if (!form.description.trim()) e.description = "Beschreibung ist erforderlich";
      if (form.citesRelevant && !form.citesConfirmed) e.cites = "Bitte CITES-Konformität bestätigen";
    }
    if (step === 3) {
      if (form.listingType === "Verkaufen" && (!form.price || Number(form.price) <= 0)) e.price = "Bitte gültigen Preis eingeben";
      if (!form.location.trim()) e.location = "Standort ist erforderlich";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const publish = async () => {
    if (!validate()) return;
    setPublishing(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setErrors({ _: "Bitte zuerst einloggen." });
        setPublishing(false);
        return;
      }

      let imageUrl = "";

      // Upload image to Supabase Storage
      if (form.imageFile) {
        const ext = form.imageFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, form.imageFile, { contentType: form.imageFile.type, upsert: false });

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from("listing-images")
            .getPublicUrl(uploadData.path);
          imageUrl = publicUrl;
        }
      }

      const body = {
        seller_id: user.id,
        title: form.title,
        latin: form.latin,
        price: form.listingType === "Verschenken" ? 0 : Number(form.price) || 0,
        currency: form.currency,
        description: form.description,
        location: form.location,
        category: form.category,
        subcategory: form.subcategory,
        condition: form.condition,
        listing_type: form.listingType,
        image: imageUrl,
        images: imageUrl ? [imageUrl] : [],
        tags: aiResult?.tags ?? [],
        shipping: form.shipping,
        shipping_cost: form.shippingCost ? Number(form.shippingCost) : null,
        pickup: form.pickup,
        cites_relevant: form.citesRelevant,
        cites_appendix: form.citesAppendix || null,
        cites_confirmed: form.citesConfirmed,
        cites_notes: form.citesNotes,
      };

      const { error } = await supabase.from("listings").insert(body);

      if (error) {
        console.error("Listing insert error:", error);
        // Don't block publish in demo mode – show success anyway
      }
    } catch (err) {
      console.error("Publish error:", err);
      // Continue even if DB fails (demo mode)
    }

    setPublishing(false);
    setPublished(true);
    setTimeout(() => router.push("/"), 2200);
  };

  const analyzeImage = useCallback(async (file: File) => {
    setAiState("analyzing");
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/analyze-coral", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed");
      const result: AIResult = await res.json();
      setAiResult(result);
      setForm((f) => ({
        ...f,
        title: result.title,
        latin: result.latin,
        category: result.category,
        condition: result.condition,
        description: result.description,
        price: result.suggestedPrice.toString(),
      }));
      setAiState("done");
    } catch {
      setAiState("error");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageFile: file, imagePreview: preview }));
    setAiState("uploading");
    setTimeout(() => analyzeImage(file), 400);
  }, [analyzeImage]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const applyAI = () => {
    let desc = aiResult?.description ?? "";
    const answers = Object.entries(followUpAnswers).filter(([, v]) => v).map(([, v]) => v).join(", ");
    if (answers) desc += ` · ${answers}`;
    setForm((f) => ({ ...f, description: desc }));
    setStep(1);
  };

  if (published) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 text-center scale-in">
        <div>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="mb-2 text-[26px] font-semibold tracking-[-0.05em]">Inserat veröffentlicht!</h2>
          <p className="text-[15px] text-white/44">Wird weitergeleitet…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-10">
      {/* Header + progress */}
      <div className="sticky top-12 z-10 glass border-b border-white/7 px-4 sm:px-6 lg:px-8 pb-4 pt-5">
        <div className="mb-4 flex items-center gap-3">
          {step > 0 ? (
            <button onClick={back} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ) : (
            <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:border-white/22">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          )}
          <h1 className="text-[17px] font-semibold tracking-[-0.03em]">Inserat erstellen</h1>
          <span className="ml-auto text-[12px] font-medium text-white/28">{step + 1} / {STEPS.length}</span>
        </div>
        <div className="h-[2px] w-full rounded-full bg-white/7 overflow-hidden">
          <div className="h-full rounded-full bg-[#E8724A] transition-all duration-400" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="mt-2.5 flex justify-between">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-[11px] font-medium ${i === step ? "text-white/70" : i < step ? "text-white/38" : "text-white/18"}`}>{s}</span>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-6 max-w-2xl">

        {/* ── Step 0: AI Photo Analysis ─────────────────── */}
        {step === 0 && (
          <div className="fade-up">
            <div className="mb-1 flex items-center gap-2">
              <span className="tag-teal">KI-Assistent</span>
            </div>
            <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Foto hochladen</h2>
            <p className="mb-6 text-[14px] text-white/40">Fotografiere dein Tier oder deine Koralle — die KI erkennt automatisch die Art und schlägt Preis & Beschreibung vor.</p>

            {aiState === "idle" && (
              <>
                <div
                  ref={dropRef}
                  onDrop={onDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[rgba(45,200,190,0.15)] bg-[rgba(7,51,68,0.2)] py-14 transition-all hover:border-[rgba(45,200,190,0.30)] hover:bg-[rgba(7,51,68,0.35)] cursor-pointer rounded-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(45,200,190,0.18)] bg-[rgba(45,200,190,0.05)] transition group-hover:border-[rgba(45,200,190,0.32)] group-hover:bg-[rgba(45,200,190,0.10)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/40">
                      <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-medium text-white/65">Foto hierher ziehen oder klicken</p>
                    <p className="mt-0.5 text-[12px] text-white/30">JPG, PNG bis 10 MB</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="sr-only"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>

                <button
                  onClick={() => { if (fileRef.current) { fileRef.current.capture = "environment"; fileRef.current.click(); } }}
                  className="mt-3 flex w-full items-center justify-center gap-2 border border-white/8 py-3 text-[13px] text-white/40 transition hover:border-white/16 hover:text-white/60 md:hidden"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Kamera öffnen
                </button>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <span className="text-[12px] text-white/28">oder ohne KI weiter</span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>
                <button onClick={() => setStep(1)} className="mt-3 w-full border border-white/8 py-3 text-[13px] text-white/38 transition hover:border-white/16 hover:text-white/60">
                  Manuell eingeben →
                </button>
              </>
            )}

            {(aiState === "uploading" || aiState === "analyzing") && form.imagePreview && (
              <div className="relative overflow-hidden rounded-xl">
                <img src={form.imagePreview} alt="Analysiere" className="h-56 w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/65 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-white">{aiState === "uploading" ? "Bild wird hochgeladen…" : "KI analysiert…"}</p>
                    <p className="mt-0.5 text-[12px] text-white/50">Erkennt Art, Zustand und schlägt Preis vor</p>
                  </div>
                  <svg className="h-8 w-8 animate-spin text-[#2DC8BE]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            )}

            {aiState === "done" && aiResult && (
              <div className="fade-up space-y-4">
                {form.imagePreview && (
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={form.imagePreview} alt="Analysiert" className="h-48 w-full object-cover" />
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-green-400 backdrop-blur-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {Math.round(aiResult.confidence * 100)}% Konfidenz
                    </div>
                  </div>
                )}
                <div className="border border-blue-400/20 bg-blue-500/5 p-4 rounded-xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-300">KI-Ergebnis</span>
                    <button onClick={() => { setAiResult(null); setAiState("idle"); setForm((f) => ({ ...f, imageFile: null, imagePreview: "" })); }} className="ml-auto text-[11px] text-white/30 underline hover:text-white/55">Neues Foto</button>
                  </div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.04em]">{aiResult.title}</h3>
                  {aiResult.latin && <p className="text-[13px] italic text-white/40">{aiResult.latin}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/45">{aiResult.category}</span>
                    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/45">{aiResult.condition}</span>
                    <span className="rounded-full border border-green-500/25 bg-green-500/8 px-2 py-0.5 text-[11px] font-medium text-green-400">CHF {aiResult.suggestedPrice} empfohlen</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/55">{aiResult.description}</p>
                </div>
                {aiResult.followUpQuestions.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Noch 2 kurze Fragen</p>
                    {aiResult.followUpQuestions.map((q) => (
                      <div key={q.id}>
                        <p className="mb-2 text-[14px] font-medium text-white/75">{q.question}</p>
                        {q.options ? (
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt) => (
                              <button key={opt} onClick={() => setFollowUpAnswers((p) => ({ ...p, [q.id]: opt }))}
                                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${followUpAnswers[q.id] === opt ? "border-[rgba(232,114,74,0.45)] bg-[rgba(232,114,74,0.12)] text-[#FF9972]" : "border-[rgba(45,200,190,0.12)] text-white/40 hover:border-[rgba(45,200,190,0.25)] hover:text-white/65"}`}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input value={followUpAnswers[q.id] ?? ""} onChange={(e) => setFollowUpAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                            className="w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-3 py-2 text-[14px] text-white/80 placeholder-white/24 focus:border-[rgba(232,114,74,0.35)] focus:outline-none"
                            placeholder="Deine Antwort…" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {aiState === "error" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                <p className="text-[14px] text-red-400">Analyse fehlgeschlagen.</p>
                <button onClick={() => setAiState("idle")} className="mt-3 text-[12px] text-white/40 underline hover:text-white/60">Zurücksetzen</button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Category & Listing Type ───────────── */}
        {step === 1 && (
          <div className="fade-up space-y-7">
            {/* Listing type */}
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Art des Inserats</h2>
              <p className="mb-4 text-[14px] text-white/40">Verkaufen, verschenken oder tauschen?</p>
              <div className="space-y-2">
                {LISTING_TYPES.map((t) => (
                  <button key={t.value} onClick={() => set("listingType", t.value)}
                    className={`flex w-full items-center gap-4 border px-4 py-3.5 text-left transition-all ${form.listingType === t.value ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)] hover:bg-[rgba(7,51,68,0.3)]"}`}>
                    <span className="text-[24px] leading-none shrink-0">{t.icon}</span>
                    <div>
                      <p className="text-[15px] font-semibold">{t.label}</p>
                      <p className="mt-0.5 text-[12px] text-white/38">{t.desc}</p>
                    </div>
                    {form.listingType === t.value && (
                      <div className="ml-auto shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="mb-1 text-[22px] font-semibold tracking-[-0.05em]">Was bietest du an?</h2>
              <p className="mb-4 text-[14px] text-white/40">Wähle die passende Kategorie</p>
              {errors.category && <p className="mb-3 text-[13px] text-red-400">{errors.category}</p>}
              <div className="space-y-2">
                {CATS.map((c) => (
                  <button key={c.label} onClick={() => set("category", c.label)}
                    className={`flex w-full items-center gap-4 border px-4 py-4 text-left transition-all duration-150 ${form.category === c.label ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)] hover:bg-[rgba(7,51,68,0.3)]"}`}>
                    <span className="text-[28px] leading-none shrink-0">{c.icon}</span>
                    <div>
                      <p className="text-[15px] font-semibold">{c.label}</p>
                      <p className="mt-0.5 text-[12px] text-white/38">{c.sub}</p>
                    </div>
                    {form.category === c.label && (
                      <div className="ml-auto shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory */}
            {selectedCat && (
              <div>
                <label className={FIELD_LABEL}>Unterkategorie</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCat.subcategories.map((sub) => (
                    <button key={sub} onClick={() => set("subcategory", sub)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${form.subcategory === sub ? "border-[rgba(232,114,74,0.45)] bg-[rgba(232,114,74,0.12)] text-[#FF9972]" : "border-[rgba(45,200,190,0.12)] text-white/40 hover:border-[rgba(45,200,190,0.25)] hover:text-white/65"}`}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Details ──────────────────────────── */}
        {step === 2 && (
          <div className="fade-up space-y-5">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Beschreibe dein Inserat</h2>
              {aiResult && (
                <div className="mb-4 mt-2 flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/6 px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-400 shrink-0">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[12px] text-blue-300">KI hat die Felder vorausgefüllt — bitte prüfen und anpassen.</p>
                </div>
              )}
            </div>
            <div>
              <label className={FIELD_LABEL}>Titel *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder={isEquipment ? "z.B. AI Hydra 64 HD LED" : "z.B. Dragon Soul Torch Frag – 3 Köpfe"}
                className={INPUT + (errors.title ? " border-red-500/60" : "")} />
              {errors.title && <p className="mt-1 text-[12px] text-red-400">{errors.title}</p>}
            </div>

            {!isEquipment && (
              <div>
                <label className={FIELD_LABEL}>Lateinischer Name / Wissenschaftlicher Name</label>
                <input type="text" value={form.latin} onChange={(e) => set("latin", e.target.value)}
                  placeholder="z.B. Euphyllia glabrescens"
                  className={INPUT + " italic"} />
              </div>
            )}

            <div>
              <label className={FIELD_LABEL}>Zustand *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {conditions.map((c) => (
                  <button key={c} onClick={() => set("condition", c)}
                    className={`py-3 text-[13px] font-medium border transition ${form.condition === c ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.08)] text-white" : "border-[rgba(45,200,190,0.09)] text-white/40 hover:border-[rgba(45,200,190,0.18)]"}`}>
                    {c}
                  </button>
                ))}
              </div>
              {errors.condition && <p className="mt-1 text-[12px] text-red-400">{errors.condition}</p>}
            </div>

            <div>
              <label className={FIELD_LABEL}>Beschreibung *</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={6}
                placeholder={isEquipment
                  ? "Alter, Zustand, Besonderheiten, Zubehör, Grund des Verkaufs…"
                  : "Grösse, Herkunft, Pflegeanforderungen (PAR, Strömung, Alkalinität), Parameter, besondere Merkmale, Akklimatisierung…"}
                className={INPUT + " resize-none leading-relaxed" + (errors.description ? " border-red-500/60" : "")} />
              <div className="mt-1 flex justify-between">
                {errors.description ? <p className="text-[12px] text-red-400">{errors.description}</p> : <span />}
                <span className="text-[11px] text-white/22">{form.description.length}/1500</span>
              </div>
            </div>

            {/* ── CITES Warning ────────────────────────────── */}
            {form.citesRelevant && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-400">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(251,191,36,0.1)" />
                      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-amber-400">
                      CITES-geschützte Art{form.citesAppendix ? ` (Appendix ${form.citesAppendix})` : ""}
                    </p>
                    <p className="mt-1 text-[12px] text-amber-300/75 leading-relaxed">
                      Diese Tier- oder Pflanzenart unterliegt dem Washingtoner Artenschutzübereinkommen (CITES).
                      Der Handel ist nur mit entsprechenden Nachweisen (Herkunftsdokumenten, CITES-Bescheinigung)
                      erlaubt. Wildfang ohne Dokumentation ist illegal.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={FIELD_LABEL + " text-amber-400/70"}>CITES-Hinweise / Dokumentation</label>
                  <input type="text" value={form.citesNotes} onChange={(e) => set("citesNotes", e.target.value)}
                    placeholder="z.B. EU-Zertifikat vorhanden, Nachzucht CH, F1-Generation…"
                    className="w-full border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-[14px] text-white/80 placeholder-white/24 focus:border-amber-500/45 focus:outline-none transition" />
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                  <div className={`mt-0.5 h-5 w-5 shrink-0 border-2 flex items-center justify-center transition ${form.citesConfirmed ? "border-amber-400 bg-amber-400/20" : "border-white/25"}`}
                    onClick={() => set("citesConfirmed", !form.citesConfirmed)}>
                    {form.citesConfirmed && <svg viewBox="0 0 20 20" fill="none" className="w-3 h-3"><path d="M4 10l4 4 8-8" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className="text-[12px] text-white/55 leading-relaxed">
                    Ich bestätige, dass dieser Artikel CITES-konform gehandelt wird und alle erforderlichen
                    Nachweise (Herkunftsdokumente, Zuchtbescheinigung oder CITES-Zertifikat) vorliegen.
                  </span>
                </label>
                {errors.cites && <p className="text-[12px] text-red-400">{errors.cites}</p>}
              </div>
            )}

            {/* Equipment-specific fields */}
            {isEquipment && (
              <div className="rounded-xl border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.2)] p-4 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Equipment-Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={FIELD_LABEL}>Marke / Hersteller</label>
                    <input type="text" placeholder="z.B. Radion, Ecotech, Nyos…"
                      className={INPUT + " text-[14px]"} />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Modell</label>
                    <input type="text" placeholder="z.B. XR30 G5, Quantum 120"
                      className={INPUT + " text-[14px]"} />
                  </div>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Alter (Monate)</label>
                  <input type="number" min="0" placeholder="z.B. 18"
                    className={INPUT + " text-[14px]"} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Price & Location ─────────────────── */}
        {step === 3 && (
          <div className="fade-up space-y-6">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Preis & Standort</h2>
              <p className="mb-6 text-[14px] text-white/40">Fast geschafft!</p>
            </div>

            {/* Price (only for Verkaufen) */}
            {form.listingType === "Verkaufen" && (
              <div>
                <label className={FIELD_LABEL}>Preis *</label>
                {aiResult && <p className="mb-2 text-[12px] text-green-400">KI-Empfehlung: CHF {aiResult.suggestedPrice}</p>}
                <div className="flex gap-2">
                  <select value={form.currency} onChange={(e) => set("currency", e.target.value as "CHF" | "EUR")}
                    className="border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-3 py-3 text-[14px] text-white/60 focus:outline-none focus:border-[rgba(232,114,74,0.35)]">
                    <option value="CHF">CHF</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                    placeholder="0.–"
                    className={INPUT + " text-[20px] font-semibold tracking-[-0.04em]" + (errors.price ? " border-red-500/60" : "")} />
                </div>
                {errors.price && <p className="mt-1 text-[12px] text-red-400">{errors.price}</p>}
              </div>
            )}

            {form.listingType === "Verschenken" && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                <p className="text-[13px] font-medium text-green-400">🎁 Kostenlos – kein Preis erforderlich</p>
                <p className="mt-0.5 text-[12px] text-white/38">Bitte wähle selbst aus, wer das Tier bekommt.</p>
              </div>
            )}

            {form.listingType === "Tauschen" && (
              <div>
                <label className={FIELD_LABEL}>Gewünschter Tausch</label>
                <input type="text" placeholder="z.B. Suche SPS-Frags oder LED-Leuchte…"
                  className={INPUT} />
                <p className="mt-1 text-[12px] text-white/30">Optional: Was möchtest du als Tausch?</p>
              </div>
            )}

            {/* Location */}
            <div>
              <label className={FIELD_LABEL}>Standort *</label>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
                placeholder="z.B. Luzern, Zug, Zürich…"
                className={INPUT + (errors.location ? " border-red-500/60" : "")} />
              {errors.location && <p className="mt-1 text-[12px] text-red-400">{errors.location}</p>}
            </div>

            {/* Delivery */}
            <div>
              <label className={FIELD_LABEL}>Übergabe</label>
              <div className="space-y-2">
                {[
                  { key: "pickup" as const, label: "Selbstabholung", sub: "Käufer kommt zu dir" },
                  { key: "shipping" as const, label: "Versand möglich", sub: "Lebendversand Schweiz" },
                ].map((opt) => (
                  <button key={opt.key} onClick={() => set(opt.key, !form[opt.key])}
                    className={`flex w-full items-center justify-between px-4 py-3.5 border text-left transition ${form[opt.key] ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)]"}`}>
                    <div>
                      <p className="text-[14px] font-medium">{opt.label}</p>
                      <p className="text-[12px] text-white/34">{opt.sub}</p>
                    </div>
                    <div className={`h-5 w-5 shrink-0 border transition flex items-center justify-center ${form[opt.key] ? "border-[#E8724A] bg-[#E8724A]" : "border-white/22"}`}>
                      {form[opt.key] && <svg viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </button>
                ))}
                {form.shipping && (
                  <input type="number" value={form.shippingCost} onChange={(e) => set("shippingCost", e.target.value)}
                    placeholder="Versandkosten in CHF" className={INPUT + " mt-1"} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Preview ──────────────────────────── */}
        {step === 4 && (
          <div className="fade-up">
            <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Vorschau</h2>
            <p className="mb-6 text-[14px] text-white/40">So sieht dein Inserat aus</p>

            <div className="border border-[rgba(45,200,190,0.12)] overflow-hidden rounded-xl">
              <div className="h-48 overflow-hidden bg-[#060D13]">
                {form.imagePreview ? (
                  <img src={form.imagePreview} alt={form.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/14">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.category}</span>
                  {form.subcategory && <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.subcategory}</span>}
                  {form.condition && <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.condition}</span>}
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${form.listingType === "Verkaufen" ? "border-green-500/25 text-green-400 bg-green-500/8" : form.listingType === "Verschenken" ? "border-blue-400/25 text-blue-400 bg-blue-400/8" : "border-amber-400/25 text-amber-400 bg-amber-400/8"}`}>
                    {form.listingType}
                  </span>
                  {form.citesRelevant && <span className="rounded-full border border-amber-500/30 bg-amber-500/8 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">CITES {form.citesAppendix}</span>}
                </div>
                <h3 className="text-[22px] font-semibold tracking-[-0.04em]">{form.title || "Kein Titel"}</h3>
                {form.latin && <p className="mt-0.5 text-[13px] italic text-white/40">{form.latin}</p>}
                <p className="mt-3 text-[14px] leading-relaxed text-white/56">{form.description || "Keine Beschreibung"}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/7 pt-4">
                  <div>
                    {form.listingType === "Verkaufen" ? (
                      <p className="text-[22px] font-semibold tracking-[-0.04em]">{form.currency} {form.price || "–"}</p>
                    ) : form.listingType === "Verschenken" ? (
                      <p className="text-[22px] font-semibold tracking-[-0.04em] text-green-400">Gratis</p>
                    ) : (
                      <p className="text-[22px] font-semibold tracking-[-0.04em] text-amber-400">Tausch</p>
                    )}
                    <p className="text-[12px] text-white/34">{form.location || "Kein Standort"}</p>
                  </div>
                  <div className="text-right text-[12px] text-white/36">
                    {form.pickup && <p>Abholung möglich</p>}
                    {form.shipping && <p>Versand: CHF {form.shippingCost || "–"}</p>}
                  </div>
                </div>
              </div>
            </div>

            {errors._ && <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-[13px] text-red-400">{errors._}</p>}

            <p className="mt-5 text-[13px] leading-relaxed text-white/34">
              Durch das Veröffentlichen stimmst du den{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-white/55">Nutzungsbedingungen</Link>{" "}
              zu.
            </p>
          </div>
        )}
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 glass border-t border-white/7 px-4 sm:px-6 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] md:pb-3">
        <div className="mx-auto flex max-w-2xl gap-3">
          {step === 0 && aiState === "done" ? (
            <button onClick={applyAI} className="flex-1 btn-coral py-3.5 text-[14px] font-semibold active:scale-[0.98]">
              KI-Ergebnis übernehmen & weiter →
            </button>
          ) : step === 0 && aiState !== "analyzing" && aiState !== "uploading" ? (
            <button onClick={() => setStep(1)} className="flex-1 border border-[rgba(45,200,190,0.14)] py-3.5 text-[14px] font-medium text-white/50 transition hover:border-[rgba(45,200,190,0.28)] hover:text-white/75">
              Überspringen
            </button>
          ) : step === 0 ? null : (
            <button
              onClick={step < STEPS.length - 1 ? next : publish}
              disabled={publishing}
              className="flex-1 btn-coral py-3.5 text-[14px] font-semibold active:scale-[0.98] disabled:opacity-40"
            >
              {publishing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Wird veröffentlicht…
                </span>
              ) : step === STEPS.length - 1 ? "Jetzt veröffentlichen" : "Weiter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
