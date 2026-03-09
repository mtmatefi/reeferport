"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: (user: { id: string; name: string; email: string; avatar: string }) => void;
  defaultTab?: "login" | "register";
  reason?: string; // e.g. "um Inserate zu speichern"
}

export default function AuthModal({ onClose, onSuccess, defaultTab = "login", reason }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "Zürich",
    type: "Privat" as "Privat" | "Händler",
  });

  const set = useCallback((k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setError("");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (tab === "register") {
        // Try Supabase Auth first
        try {
          const { data: sbData, error: sbError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
              data: { name: form.name, location: form.location, type: form.type },
            },
          });
          if (!sbError && sbData.user) {
            const user = {
              id: sbData.user.id,
              name: form.name,
              email: form.email,
              avatar: "",
            };
            setLoading(false);
            onSuccess?.(user);
            onClose();
            router.refresh();
            return;
          }
          // If Supabase error, fall through to JWT fallback
        } catch {
          // Supabase unreachable, fall through to JWT fallback
        }

        // Fallback: existing JWT register endpoint
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            location: form.location,
            type: form.type,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(data.error || "Fehler beim Registrieren.");
          return;
        }
        onSuccess?.(data.user);
        onClose();
        router.refresh();
      } else {
        // Login: Try Supabase Auth first
        try {
          const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });
          if (!sbError && sbData.user) {
            const meta = sbData.user.user_metadata ?? {};
            const user = {
              id: sbData.user.id,
              name: meta.name ?? form.email,
              email: form.email,
              avatar: meta.avatar ?? "",
            };
            setLoading(false);
            onSuccess?.(user);
            onClose();
            router.refresh();
            return;
          }
          // If Supabase error, fall through to JWT fallback
        } catch {
          // Supabase unreachable, fall through to JWT fallback
        }

        // Fallback: existing JWT login endpoint
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(data.error || "Fehler beim Anmelden.");
          return;
        }
        onSuccess?.(data.user);
        onClose();
        router.refresh();
      }
    } catch {
      setLoading(false);
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1420] p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-white/40 transition-colors hover:text-white"
          aria-label="Schliessen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-blue-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(96,165,250,0.2)" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-white/50">
              {reason ? `Bitte einloggen ${reason}` : "Willkommen bei Gesellschaftsbecken"}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            {tab === "login" ? "Anmelden" : "Konto erstellen"}
          </h2>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex rounded-xl bg-white/5 p-1">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${
                tab === t ? "bg-blue-500/20 text-blue-300" : "text-white/40 hover:text-white/70"
              }`}
            >
              {t === "login" ? "Anmelden" : "Registrieren"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {tab === "register" && (
            <>
              <div>
                <label className="mb-1 block text-xs text-white/50">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Dein Name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-white/50">Ort</label>
                  <input
                    value={form.location}
                    onChange={set("location")}
                    placeholder="Zürich"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-white/50">Typ</label>
                  <select
                    value={form.type}
                    onChange={set("type")}
                    className="w-full rounded-lg border border-white/10 bg-[#0B1420] px-3 py-2 text-sm text-white outline-none focus:border-blue-400/50"
                  >
                    <option value="Privat">Privat</option>
                    <option value="Händler">Händler</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-xs text-white/50">E-Mail</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="deine@email.ch"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/50">Passwort</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder={tab === "register" ? "Mindestens 6 Zeichen" : "••••••••"}
              minLength={tab === "register" ? 6 : undefined}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Bitte warten…
              </span>
            ) : tab === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </form>

        {tab === "login" && (
          <div className="mt-4 rounded-xl border border-white/5 bg-white/3 p-3 text-xs text-white/40">
            <p className="font-medium text-white/60">Demo-Zugänge:</p>
            <p className="mt-1">demo@gesellschaftsbecken.ch / demo123</p>
            <p>shop@reefalliance.ch / demo123</p>
          </div>
        )}
      </div>
    </div>
  );
}
