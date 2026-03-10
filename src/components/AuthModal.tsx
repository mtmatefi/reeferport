"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: (user: { id: string; name: string; email: string; avatar: string }) => void;
  defaultTab?: "login" | "register";
  reason?: string;
}

export default function AuthModal({ onClose, onSuccess, defaultTab = "login", reason }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    const supabase = createClient();

    if (tab === "login") {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError("E-Mail oder Passwort falsch.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name ?? data.user.email!.split("@")[0],
        avatar: profile?.avatar ?? `https://i.pravatar.cc/150?u=${data.user.email}`,
      };

      setLoading(false);
      onSuccess?.(user);
      onClose();
      router.refresh();

    } else {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            location: form.location,
            type: form.type,
            avatar: `https://i.pravatar.cc/150?u=${form.email}`,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already")) {
          setError("Diese E-Mail ist bereits registriert.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      setLoading(false);

      if (data.session) {
        // Auto-confirmed (email confirmation disabled in Supabase)
        const user = {
          id: data.user!.id,
          email: data.user!.email!,
          name: form.name,
          avatar: `https://i.pravatar.cc/150?u=${form.email}`,
        };
        onSuccess?.(user);
        onClose();
        router.refresh();
      } else {
        // Email confirmation required
        setSuccess("Bestätigungs-E-Mail gesendet! Bitte prüfe deinen Posteingang.");
      }
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#2DC8BE]">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(45,200,190,0.15)" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-white/50">
              {reason ? `Bitte einloggen ${reason}` : "Willkommen bei ReeferPort"}
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
              onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${
                tab === t ? "bg-[rgba(45,200,190,0.15)] text-[#2DC8BE]" : "text-white/40 hover:text-white/70"
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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[rgba(45,200,190,0.5)] focus:ring-1 focus:ring-[rgba(45,200,190,0.2)]"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-white/50">Ort</label>
                  <input
                    value={form.location}
                    onChange={set("location")}
                    placeholder="Zürich"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[rgba(45,200,190,0.5)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-white/50">Typ</label>
                  <select
                    value={form.type}
                    onChange={set("type")}
                    className="w-full rounded-lg border border-white/10 bg-[#0B1420] px-3 py-2 text-sm text-white outline-none focus:border-[rgba(45,200,190,0.5)]"
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[rgba(45,200,190,0.5)] focus:ring-1 focus:ring-[rgba(45,200,190,0.2)]"
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
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[rgba(45,200,190,0.5)] focus:ring-1 focus:ring-[rgba(45,200,190,0.2)]"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          {success && (
            <p className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-[#2DC8BE] py-2.5 text-sm font-semibold text-[#060D13] transition-all hover:bg-[#3DDDD3] active:scale-98 disabled:opacity-50"
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

        {tab === "register" && (
          <p className="mt-4 text-center text-[11px] text-white/28">
            Mit der Registrierung stimmst du den Nutzungsbedingungen und der Datenschutzerklärung zu.
          </p>
        )}
      </div>
    </div>
  );
}
