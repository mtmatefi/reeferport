"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  type Category,
  type Subcategory,
  type OfferType,
  SUBCATEGORIES,
  CITES_INFO,
  EQUIPMENT_TYPES,
  EQUIPMENT_BRANDS,
  OFFER_TYPE_LABELS,
} from "@/lib/data";

const STEPS = ["KI-Analyse", "Angebotstyp", "Details", "Preis & Ort", "Vorschau"] as const;

const CATS: { label: Category; icon: string; sub: string }[] = [
  { label: "Korallen",   icon: "\u{1FAB8}", sub: "LPS, SPS, Weichkorallen, Zoanthus" },
  { label: "Fische",     icon: "\u{1F420}", sub: "Meerwasserfische aller Arten" },
  { label: "Wirbellose", icon: "\u{1F99E}", sub: "Garnelen, Muscheln, Krabben, Schnecken" },
  { label: "Anemonen",   icon: "\u{1F33A}", sub: "Blasen-, Teppich-, Scheibenanemonen" },
  { label: "Equipment",  icon: "\u{1F4A1}", sub: "Pumpen, Leuchten, Filter, Technik" },
  { label: "Frags",      icon: "\u{1FAA8}", sub: "Ableger, Frags, kleine Kolonien" },
];

const CONDITIONS = ["Nachzucht", "Wildfang", "Neu", "Gebraucht"];

const OFFER_TYPES: { value: OfferType; icon: string; sub: string }[] = [
  { value: "sell",  icon: "\u{1F4B0}", sub: "Inserat mit Preisangabe" },
  { value: "trade", icon: "\u{1F501}", sub: "Tausch gegen etwas anderes" },
  { value: "gift",  icon: "\u{1F381}", sub: "Kostenlos abzugeben" },
];

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
  offerType: OfferType;
  category: string;
  subcategory: string;
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
  imageFiles: File[];
  imagePreviews: string[];
  // CITES
  citesRequired: boolean;
  citesNumber: string;
  citesAppendix: string;
  citesSource: string;
  // Equipment
  equipmentType: string;
  brand: string;
  wattage: string;
  tankSizeMin: string;
  tankSizeMax: string;
  // Trade
  tradeDescription: string;
}

const EMPTY: Form = {
  offerType: "sell",
  category: "", subcategory: "", title: "", latin: "", condition: "", description: "",
  price: "", currency: "CHF", location: "", shipping: false, shippingCost: "",
  pickup: true, imageFiles: [], imagePreviews: [],
  citesRequired: false, citesNumber: "", citesAppendix: "", citesSource: "",
  equipmentType: "", brand: "", wattage: "", tankSizeMin: "", tankSizeMax: "",
  tradeDescription: "",
};

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30";
const INPUT = "w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-4 py-3 text-[15px] text-white/88 placeholder-white/24 focus:border-[rgba(232,114,74,0.35)] focus:outline-none transition";
const SELECT = "w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-4 py-3 text-[15px] text-white/88 focus:border-[rgba(232,114,74,0.35)] focus:outline-none transition appearance-none";

function needsCites(category: string, condition: string): boolean {
  const catMatch = CITES_INFO.requiredCategories.includes(category as Category);
  const condMatch = CITES_INFO.requiredConditions.includes(condition as never);
  return catMatch || condMatch;
}

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // AI Step state
  const [aiState, setAiState] = useState<"idle" | "uploading" | "analyzing" | "done" | "error">("idle");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Form, v: string | boolean | File[] | string[] | null) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (step === 1) {
      if (!form.offerType) e.offerType = "Bitte Angebotstyp wählen";
      if (!form.category) e.category = "Bitte Kategorie wählen";
    }
    if (step === 2) {
      if (!form.title.trim()) e.title = "Titel ist erforderlich";
      if (!form.condition) e.condition = "Bitte Zustand wählen";
      if (!form.description.trim()) e.description = "Beschreibung ist erforderlich";
      if (form.citesRequired && !form.citesAppendix) e.citesAppendix = "CITES-Anhang auswählen";
      if (form.citesRequired && !form.citesSource) e.citesSource = "CITES-Quelle auswählen";
    }
    if (step === 3) {
      if (form.offerType === "sell") {
        if (!form.price || Number(form.price) <= 0) e.price = "Bitte gültigen Preis eingeben";
      }
      if (form.offerType === "trade" && !form.tradeDescription.trim()) {
        e.tradeDescription = "Bitte beschreibe, was du im Tausch suchst";
      }
      if (!form.location.trim()) e.location = "Standort ist erforderlich";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  // Upload images to Supabase Storage
  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of form.imageFiles) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("listings").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (!error) {
        const { data } = supabase.storage.from("listings").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  const publish = async () => {
    setUploading(true);
    let imageUrls = form.imagePreviews;
    try {
      if (form.imageFiles.length > 0) {
        const uploaded = await uploadImages();
        if (uploaded.length > 0) imageUrls = uploaded;
      }
    } catch {
      // continue with preview URLs if upload fails
    }

    const body = {
      title: form.title,
      latin: form.latin,
      price: form.offerType === "gift" ? 0 : form.offerType === "trade" ? 0 : Number(form.price),
      currency: form.currency,
      description: form.description,
      location: form.location,
      category: form.category,
      subcategory: form.subcategory,
      condition: form.condition,
      offerType: form.offerType,
      image: imageUrls[0] || "https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg",
      images: imageUrls,
      shipping: form.shipping,
      shippingCost: form.shippingCost ? Number(form.shippingCost) : null,
      pickup: form.pickup,
      tags: aiResult?.tags ?? [],
      listingType: "C2C",
      // CITES
      citesRequired: form.citesRequired,
      citesNumber: form.citesNumber || null,
      citesAppendix: form.citesAppendix || null,
      citesSource: form.citesSource || null,
      // Equipment
      equipmentType: form.equipmentType || null,
      brand: form.brand || null,
      wattage: form.wattage ? Number(form.wattage) : null,
      tankSizeMin: form.tankSizeMin ? Number(form.tankSizeMin) : null,
      tankSizeMax: form.tankSizeMax ? Number(form.tankSizeMax) : null,
      // Trade
      tradeDescription: form.tradeDescription || null,
    };
    try {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      // continue even if API fails (demo mode)
    }
    setUploading(false);
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
    setForm((f) => ({
      ...f,
      imageFiles: [file, ...f.imageFiles],
      imagePreviews: [preview, ...f.imagePreviews],
    }));
    setAiState("uploading");
    setTimeout(() => analyzeImage(file), 400);
  }, [analyzeImage]);

  const handleMultipleFiles = useCallback((files: FileList) => {
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith("image/")) {
        newFiles.push(f);
        newPreviews.push(URL.createObjectURL(f));
      }
    }
    setForm((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...newFiles],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const applyAI = () => {
    let desc = aiResult?.description ?? "";
    const answers = Object.entries(followUpAnswers)
      .filter(([, v]) => v)
      .map(([, v]) => v)
      .join(", ");
    if (answers) desc += ` \u00b7 ${answers}`;
    setForm((f) => ({ ...f, description: desc }));
    setStep(1);
  };

  const subcategories = form.category ? SUBCATEGORIES[form.category as Category] ?? [] : [];
  const showCites = needsCites(form.category, form.condition);
  const isEquipment = form.category === "Equipment";

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
          <p className="text-[15px] text-white/44">Wird nach Prüfung freigeschaltet. Du wirst weitergeleitet…</p>
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
                <button
                  onClick={() => setStep(1)}
                  className="mt-3 w-full border border-white/8 py-3 text-[13px] text-white/38 transition hover:border-white/16 hover:text-white/60"
                >
                  Manuell eingeben →
                </button>
              </>
            )}

            {aiState === "uploading" && form.imagePreviews[0] && (
              <div className="relative overflow-hidden">
                <img src={form.imagePreviews[0]} alt="Upload" className="h-56 w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 backdrop-blur-sm">
                  <svg className="h-8 w-8 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <p className="text-[14px] font-medium text-white">Bild wird hochgeladen…</p>
                </div>
              </div>
            )}

            {aiState === "analyzing" && form.imagePreviews[0] && (
              <div className="relative overflow-hidden">
                <img src={form.imagePreviews[0]} alt="Analysiere" className="h-56 w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/65 backdrop-blur-sm">
                  <div className="relative w-40">
                    <div className="h-px w-full bg-blue-400/30" />
                    <div className="absolute -top-1 left-0 h-2.5 w-2.5 animate-[ping_0.8s_ease-in-out_infinite] rounded-full bg-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-semibold text-white">KI analysiert…</p>
                    <p className="mt-0.5 text-[12px] text-white/50">Erkennt Art, Zustand und schlägt Preis vor</p>
                  </div>
                  <div className="space-y-1.5 text-left text-[12px] text-white/50">
                    {["Art identifizieren", "Preis recherchieren", "Beschreibung generieren"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 animate-spin" style={{ animationDelay: `${i * 0.3}s` }} viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {aiState === "done" && aiResult && (
              <div className="fade-up space-y-4">
                {form.imagePreviews[0] && (
                  <div className="relative overflow-hidden">
                    <img src={form.imagePreviews[0]} alt="Analysiert" className="h-48 w-full object-cover" />
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-green-400 backdrop-blur-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {Math.round(aiResult.confidence * 100)}% Konfidenz
                    </div>
                  </div>
                )}

                <div className="border border-blue-400/20 bg-blue-500/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-300">KI-Ergebnis</span>
                    <button
                      onClick={() => { setAiResult(null); setAiState("idle"); setForm((f) => ({ ...f, imageFiles: [], imagePreviews: [] })); }}
                      className="ml-auto text-[11px] text-white/30 underline hover:text-white/55"
                    >
                      Neues Foto
                    </button>
                  </div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.04em]">{aiResult.title}</h3>
                  {aiResult.latin && <p className="text-[13px] italic text-white/40">{aiResult.latin}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/45">{aiResult.category}</span>
                    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/45">{aiResult.condition}</span>
                    <span className="rounded-full border border-green-500/25 bg-green-500/8 px-2 py-0.5 text-[11px] font-medium text-green-400">
                      CHF {aiResult.suggestedPrice} empfohlen
                    </span>
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
                              <button
                                key={opt}
                                onClick={() => setFollowUpAnswers((p) => ({ ...p, [q.id]: opt }))}
                                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${followUpAnswers[q.id] === opt ? "border-[rgba(232,114,74,0.45)] bg-[rgba(232,114,74,0.12)] text-[#FF9972]" : "border-[rgba(45,200,190,0.12)] text-white/40 hover:border-[rgba(45,200,190,0.25)] hover:text-white/65"}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <input
                            value={followUpAnswers[q.id] ?? ""}
                            onChange={(e) => setFollowUpAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                            className="w-full border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-3 py-2 text-[14px] text-white/80 placeholder-white/24 focus:border-[rgba(232,114,74,0.35)] focus:outline-none"
                            placeholder="Deine Antwort…"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {aiState === "error" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                <p className="text-[14px] text-red-400">Analyse fehlgeschlagen. Bitte erneut versuchen.</p>
                <button onClick={() => setAiState("idle")} className="mt-3 text-[12px] text-white/40 underline hover:text-white/60">Zurücksetzen</button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Offer Type + Category + Subcategory ── */}
        {step === 1 && (
          <div className="fade-up space-y-8">
            {/* Offer Type */}
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">Was möchtest du tun?</h2>
              <p className="mb-5 text-[14px] text-white/40">Wähle den Angebotstyp</p>
              {errors.offerType && <p className="mb-3 text-[13px] text-red-400">{errors.offerType}</p>}
              <div className="grid grid-cols-3 gap-2">
                {OFFER_TYPES.map((ot) => (
                  <button
                    key={ot.value}
                    onClick={() => set("offerType", ot.value)}
                    className={`flex flex-col items-center gap-2 border px-3 py-4 text-center transition-all duration-150 ${form.offerType === ot.value ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)] hover:bg-[rgba(7,51,68,0.3)]"}`}
                  >
                    <span className="text-[24px]">{ot.icon}</span>
                    <div>
                      <p className="text-[14px] font-semibold">{OFFER_TYPE_LABELS[ot.value]}</p>
                      <p className="mt-0.5 text-[11px] text-white/34">{ot.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="mb-1 text-[20px] font-semibold tracking-[-0.04em]">Kategorie</h2>
              <p className="mb-4 text-[14px] text-white/40">Wähle die passende Kategorie aus</p>
              {errors.category && <p className="mb-3 text-[13px] text-red-400">{errors.category}</p>}
              <div className="space-y-2">
                {CATS.map((c) => (
                  <button key={c.label} onClick={() => { set("category", c.label); set("subcategory", ""); }}
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
            {form.category && subcategories.length > 0 && (
              <div>
                <h2 className="mb-1 text-[20px] font-semibold tracking-[-0.04em]">Unterkategorie</h2>
                <p className="mb-4 text-[14px] text-white/40">Grenze die Kategorie weiter ein (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  {subcategories.map((sc) => (
                    <button
                      key={sc.value}
                      onClick={() => set("subcategory", sc.value)}
                      className={`border px-3 py-3 text-left transition-all duration-150 ${form.subcategory === sc.value ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)] hover:bg-[rgba(7,51,68,0.3)]"}`}
                    >
                      <p className="text-[13px] font-medium">{sc.label}</p>
                      {sc.info && <p className="mt-0.5 text-[11px] text-white/30 line-clamp-2">{sc.info}</p>}
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
              {!aiResult && <p className="mb-6 text-[14px] text-white/40">Präzise Angaben = mehr Anfragen</p>}
            </div>

            {/* Title */}
            <div>
              <label className={FIELD_LABEL}>Titel *</label>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder={`z.B. ${form.category === "Korallen" ? "Dragon Soul Torch Frag" : form.category === "Fische" ? "Mandarinfisch Paar" : "AI Hydra 64 HD LED"}`}
                className={INPUT + (errors.title ? " border-red-500/60" : "")} />
              {errors.title && <p className="mt-1 text-[12px] text-red-400">{errors.title}</p>}
            </div>

            {/* Latin name (not for equipment) */}
            {!isEquipment && (
              <div>
                <label className={FIELD_LABEL}>Lateinischer Name</label>
                <input type="text" value={form.latin} onChange={(e) => set("latin", e.target.value)}
                  placeholder="z.B. Euphyllia glabrescens"
                  className={INPUT + " italic"} />
              </div>
            )}

            {/* Condition */}
            <div>
              <label className={FIELD_LABEL}>Zustand *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONDITIONS.map((c) => (
                  <button key={c} onClick={() => set("condition", c)}
                    className={`py-3 text-[13px] font-medium border transition ${form.condition === c ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.08)] text-white" : "border-[rgba(45,200,190,0.09)] text-white/40 hover:border-[rgba(45,200,190,0.18)]"}`}>
                    {c}
                  </button>
                ))}
              </div>
              {errors.condition && <p className="mt-1 text-[12px] text-red-400">{errors.condition}</p>}
            </div>

            {/* Description */}
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

            {/* Multiple image upload */}
            <div>
              <label className={FIELD_LABEL}>Bilder</label>
              <div className="flex flex-wrap gap-2">
                {form.imagePreviews.map((src, i) => (
                  <div key={i} className="relative h-20 w-20 overflow-hidden rounded border border-white/10">
                    <img src={src} alt={`Bild ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white/70 hover:text-white"
                    >
                      ×
                    </button>
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-center text-[9px] text-white/60">Titelbild</span>}
                  </div>
                ))}
                <button
                  onClick={() => multiFileRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-[rgba(45,200,190,0.15)] text-white/30 transition hover:border-[rgba(45,200,190,0.30)] hover:text-white/50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span className="text-[10px]">Hinzufügen</span>
                </button>
                <input ref={multiFileRef} type="file" accept="image/*" multiple className="sr-only"
                  onChange={(e) => e.target.files && handleMultipleFiles(e.target.files)} />
              </div>
              <p className="mt-1.5 text-[11px] text-white/25">Bis zu 8 Bilder. Das erste Bild wird als Titelbild verwendet.</p>
            </div>

            {/* ── CITES Compliance Section ── */}
            {showCites && (
              <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-400 shrink-0">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[13px] font-semibold text-amber-300">CITES-Artenschutz</p>
                </div>

                <p className="text-[12px] leading-relaxed text-white/45">{CITES_INFO.info}</p>

                {/* CITES toggle */}
                <button
                  onClick={() => set("citesRequired", !form.citesRequired)}
                  className={`flex w-full items-center justify-between px-4 py-3 border text-left transition ${form.citesRequired ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)]"}`}
                >
                  <div>
                    <p className="text-[14px] font-medium">CITES-Dokument vorhanden</p>
                    <p className="text-[12px] text-white/34">Ich habe eine gültige CITES-Bescheinigung</p>
                  </div>
                  <div className={`h-5 w-5 shrink-0 border transition flex items-center justify-center ${form.citesRequired ? "border-[#E8724A] bg-[#E8724A]" : "border-white/22"}`}>
                    {form.citesRequired && <svg viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                </button>

                {form.citesRequired && (
                  <div className="space-y-4 pt-1">
                    {/* Appendix */}
                    <div>
                      <label className={FIELD_LABEL}>CITES Anhang *</label>
                      <div className="space-y-1.5">
                        {CITES_INFO.appendices.map((a) => (
                          <button
                            key={a.value}
                            onClick={() => set("citesAppendix", a.value)}
                            className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition ${form.citesAppendix === a.value ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)]"}`}
                          >
                            <div className={`h-4 w-4 shrink-0 rounded-full border transition ${form.citesAppendix === a.value ? "border-[#E8724A] bg-[#E8724A]" : "border-white/22"}`} />
                            <div>
                              <p className="text-[13px] font-medium">{a.label}</p>
                              <p className="text-[11px] text-white/34">{a.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.citesAppendix && <p className="mt-1 text-[12px] text-red-400">{errors.citesAppendix}</p>}
                    </div>

                    {/* Source */}
                    <div>
                      <label className={FIELD_LABEL}>Herkunft / Quelle *</label>
                      <div className="space-y-1.5">
                        {CITES_INFO.sources.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => set("citesSource", s.value)}
                            className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition ${form.citesSource === s.value ? "border-[rgba(232,114,74,0.35)] bg-[rgba(232,114,74,0.07)]" : "border-[rgba(45,200,190,0.09)] hover:border-[rgba(45,200,190,0.18)]"}`}
                          >
                            <div className={`h-4 w-4 shrink-0 rounded-full border transition ${form.citesSource === s.value ? "border-[#E8724A] bg-[#E8724A]" : "border-white/22"}`} />
                            <div>
                              <p className="text-[13px] font-medium">{s.label}</p>
                              <p className="text-[11px] text-white/34">{s.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.citesSource && <p className="mt-1 text-[12px] text-red-400">{errors.citesSource}</p>}
                    </div>

                    {/* CITES Number */}
                    <div>
                      <label className={FIELD_LABEL}>CITES-Nummer / EG-Bescheinigung</label>
                      <input
                        type="text"
                        value={form.citesNumber}
                        onChange={(e) => set("citesNumber", e.target.value)}
                        placeholder="z.B. CH-2026-MW-00431"
                        className={INPUT}
                      />
                      <p className="mt-1 text-[11px] text-white/25">Wird erst nach Verifizierung durch den Käufer sichtbar.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Equipment-specific fields ── */}
            {isEquipment && (
              <div className="border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.15)] p-4 rounded-xl space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">Equipment-Details</p>

                {/* Equipment Type */}
                <div>
                  <label className={FIELD_LABEL}>Gerätetyp</label>
                  <select
                    value={form.equipmentType}
                    onChange={(e) => set("equipmentType", e.target.value)}
                    className={SELECT}
                  >
                    <option value="">Typ wählen…</option>
                    {EQUIPMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className={FIELD_LABEL}>Marke</label>
                  <select
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    className={SELECT}
                  >
                    <option value="">Marke wählen…</option>
                    {EQUIPMENT_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Wattage */}
                <div>
                  <label className={FIELD_LABEL}>Leistung (Watt)</label>
                  <input
                    type="number"
                    value={form.wattage}
                    onChange={(e) => set("wattage", e.target.value)}
                    placeholder="z.B. 135"
                    className={INPUT}
                  />
                </div>

                {/* Tank size range */}
                <div>
                  <label className={FIELD_LABEL}>Geeignet für Beckengrösse (Liter)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={form.tankSizeMin}
                      onChange={(e) => set("tankSizeMin", e.target.value)}
                      placeholder="Min"
                      className={INPUT}
                    />
                    <span className="text-white/30 shrink-0">–</span>
                    <input
                      type="number"
                      value={form.tankSizeMax}
                      onChange={(e) => set("tankSizeMax", e.target.value)}
                      placeholder="Max"
                      className={INPUT}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Price & Location ─────────────────── */}
        {step === 3 && (
          <div className="fade-up space-y-6">
            <div>
              <h2 className="mb-1 text-[24px] font-semibold tracking-[-0.05em]">
                {form.offerType === "gift" ? "Standort & Übergabe" : form.offerType === "trade" ? "Tausch & Standort" : "Preis & Standort"}
              </h2>
              <p className="mb-6 text-[14px] text-white/40">Fast geschafft!</p>
            </div>

            {/* Price (only for sell) */}
            {form.offerType === "sell" && (
              <div>
                <label className={FIELD_LABEL}>Preis *</label>
                {aiResult && (
                  <p className="mb-2 text-[12px] text-green-400">KI-Empfehlung: CHF {aiResult.suggestedPrice}</p>
                )}
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

            {/* Trade description */}
            {form.offerType === "trade" && (
              <div>
                <label className={FIELD_LABEL}>Was suchst du im Tausch? *</label>
                <textarea
                  value={form.tradeDescription}
                  onChange={(e) => set("tradeDescription", e.target.value)}
                  rows={3}
                  placeholder="z.B. Suche Euphyllia-Ableger (Torch/Hammer), Wert ca. CHF 40–60"
                  className={INPUT + " resize-none leading-relaxed" + (errors.tradeDescription ? " border-red-500/60" : "")}
                />
                {errors.tradeDescription && <p className="mt-1 text-[12px] text-red-400">{errors.tradeDescription}</p>}
              </div>
            )}

            {/* Gift info box */}
            {form.offerType === "gift" && (
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                <span className="text-[22px]">{"\u{1F381}"}</span>
                <div>
                  <p className="text-[14px] font-medium text-green-300">Kostenlos abzugeben</p>
                  <p className="text-[12px] text-white/40">Dein Inserat wird als Geschenk angezeigt — kein Preis nötig.</p>
                </div>
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
                {form.imagePreviews.length > 0 ? (
                  <img src={form.imagePreviews[0]} alt={form.title} className="h-full w-full object-cover" />
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
              {/* Additional images strip */}
              {form.imagePreviews.length > 1 && (
                <div className="flex gap-1 bg-[#060D13] px-2 pb-2">
                  {form.imagePreviews.slice(1).map((src, i) => (
                    <div key={i} className="h-12 w-12 overflow-hidden rounded border border-white/8">
                      <img src={src} alt={`Bild ${i + 2}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <div className="p-5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {form.offerType !== "sell" && (
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${form.offerType === "gift" ? "border-green-500/25 bg-green-500/8 text-green-400" : "border-blue-400/25 bg-blue-400/8 text-blue-300"}`}>
                      {OFFER_TYPE_LABELS[form.offerType]}
                    </span>
                  )}
                  <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.category}</span>
                  {form.subcategory && <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.subcategory}</span>}
                  {form.condition && <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] text-white/42">{form.condition}</span>}
                </div>
                <h3 className="text-[22px] font-semibold tracking-[-0.04em]">{form.title || "Kein Titel"}</h3>
                {form.latin && <p className="mt-0.5 text-[13px] italic text-white/40">{form.latin}</p>}
                <p className="mt-3 text-[14px] leading-relaxed text-white/56">{form.description || "Keine Beschreibung"}</p>

                {/* CITES badge */}
                {form.citesRequired && (
                  <div className="mt-3 flex items-center gap-2 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-400 shrink-0">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[12px] text-amber-300">
                      CITES Anhang {form.citesAppendix} · Quelle {form.citesSource}
                      {form.citesNumber && ` · Nr. ${form.citesNumber}`}
                    </p>
                  </div>
                )}

                {/* Equipment details */}
                {isEquipment && (form.equipmentType || form.brand || form.wattage) && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {form.equipmentType && <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/42">{form.equipmentType}</span>}
                    {form.brand && <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/42">{form.brand}</span>}
                    {form.wattage && <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/42">{form.wattage}W</span>}
                    {(form.tankSizeMin || form.tankSizeMax) && (
                      <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-white/42">
                        {form.tankSizeMin || "?"} – {form.tankSizeMax || "?"} L
                      </span>
                    )}
                  </div>
                )}

                {/* Trade description */}
                {form.offerType === "trade" && form.tradeDescription && (
                  <div className="mt-3 rounded border border-blue-400/15 bg-blue-400/5 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-300 mb-1">Tausch gesucht</p>
                    <p className="text-[13px] text-white/55">{form.tradeDescription}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-white/7 pt-4">
                  <div>
                    {form.offerType === "sell" ? (
                      <p className="text-[22px] font-semibold tracking-[-0.04em]">{form.currency} {form.price || "–"}</p>
                    ) : form.offerType === "gift" ? (
                      <p className="text-[22px] font-semibold tracking-[-0.04em] text-green-400">Gratis</p>
                    ) : (
                      <p className="text-[22px] font-semibold tracking-[-0.04em] text-blue-300">Tausch</p>
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

            <p className="mt-5 text-[13px] leading-relaxed text-white/34">
              Durch das Veröffentlichen stimmst du den{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-white/55">Nutzungsbedingungen</Link>{" "}
              zu. Inserate werden nach Überprüfung innerhalb von 24h freigeschaltet.
            </p>
          </div>
        )}
      </div>

      {/* Sticky footer CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 glass border-t border-white/7 px-4 sm:px-6 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] md:pb-3">
        <div className="mx-auto flex max-w-2xl gap-3">
          {step === 0 && aiState === "done" ? (
            <button
              onClick={applyAI}
              className="flex-1 btn-coral py-3.5 text-[14px] font-semibold active:scale-[0.98]"
            >
              KI-Ergebnis übernehmen & weiter →
            </button>
          ) : step === 0 && aiState !== "analyzing" && aiState !== "uploading" ? (
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-[rgba(45,200,190,0.14)] py-3.5 text-[14px] font-medium text-white/50 transition hover:border-[rgba(45,200,190,0.28)] hover:text-white/75"
            >
              Überspringen
            </button>
          ) : step === 0 ? null : (
            <button
              onClick={step < STEPS.length - 1 ? next : publish}
              disabled={uploading}
              className="flex-1 btn-coral py-3.5 text-[14px] font-semibold active:scale-[0.98] disabled:opacity-40"
            >
              {uploading ? "Wird veröffentlicht…" : step === STEPS.length - 1 ? "Jetzt veröffentlichen" : "Weiter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
