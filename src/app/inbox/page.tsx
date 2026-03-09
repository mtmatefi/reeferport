"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";

function InboxContent() {
  const { conversations, sendMessage, markRead } = useStore();
  const params = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(params.get("conv"));
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    if (activeId) markRead(activeId);
  }, [activeId, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  const send = () => {
    if (!draft.trim() || !activeId) return;
    sendMessage(activeId, draft.trim());
    setDraft("");
    inputRef.current?.focus();
  };

  const lastMsg = (conv: typeof conversations[0]) => conv.messages[conv.messages.length - 1];

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100svh - 0px)" }}>
      {/* Header */}
      <div className="shrink-0 border-b border-white/7 px-4 sm:px-6 lg:px-8 py-5">
        <h1 className="text-[22px] font-semibold tracking-[-0.04em]">Nachrichten</h1>
        <p className="mt-0.5 text-[13px] text-white/36">
          {conversations.reduce((s, c) => s + c.unread, 0)} ungelesen
        </p>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden md:grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr]">
        {/* Conversation list */}
        <div className={`flex flex-col border-r border-white/7 overflow-y-auto ${activeId ? "hidden md:flex" : "flex"}`}>
          {conversations.map((conv) => {
            const last = lastMsg(conv);
            const isActive = conv.id === activeId;
            return (
              <button key={conv.id} onClick={() => setActiveId(conv.id)}
                className={`flex items-start gap-3 px-4 py-4 text-left border-b border-[rgba(45,200,190,0.06)] transition ${isActive ? "bg-[rgba(232,114,74,0.07)]" : "hover:bg-[rgba(7,51,68,0.4)]"}`}>
                <div className="relative shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="h-11 w-11 rounded-full object-cover" />
                  {conv.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E8724A] px-1 text-[9px] font-semibold text-white">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <span className={`text-[14px] font-semibold truncate ${conv.unread > 0 ? "text-white" : "text-white/78"}`}>{conv.name}</span>
                    <span className="shrink-0 text-[11px] text-white/28">{last?.time}</span>
                  </div>
                  <p className="text-[11px] text-white/30 mb-1 truncate">{conv.listing}</p>
                  <p className={`truncate text-[13px] leading-snug ${conv.unread > 0 ? "font-medium text-white/70" : "text-white/38"}`}>
                    {last?.from === "me" && <span className="text-white/26">Du: </span>}
                    {last?.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat panel */}
        {active ? (
          <div className={`flex flex-col overflow-hidden ${activeId ? "flex" : "hidden md:flex"}`}>
            {/* Chat header */}
            <div className="shrink-0 flex items-center gap-3 border-b border-white/7 glass px-4 sm:px-6 py-3.5">
              <button onClick={() => setActiveId(null)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(45,200,190,0.18)] hover:border-[rgba(45,200,190,0.35)] transition md:hidden">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <img src={active.avatar} alt={active.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
              <div>
                <p className="text-[15px] font-semibold">{active.name}</p>
                <p className="text-[12px] text-white/36">{active.listing}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
              {active.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] px-4 py-2.5 ${msg.from === "me" ? "rounded-l-2xl rounded-br-2xl bg-[rgba(232,114,74,0.18)]" : "rounded-r-2xl rounded-bl-2xl bg-[rgba(7,51,68,0.55)] border border-[rgba(45,200,190,0.08)]"}`}>
                    <p className="text-[14px] leading-relaxed text-white/84">{msg.text}</p>
                    <p className={`mt-1 text-[10px] text-white/26 ${msg.from === "me" ? "text-right" : ""}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/7 px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2.5">
                <input ref={inputRef} type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Nachricht schreiben…"
                  className="flex-1 border border-[rgba(45,200,190,0.12)] bg-[rgba(7,51,68,0.3)] px-4 py-2.5 text-[14px] text-white/86 placeholder-white/26 focus:border-[rgba(232,114,74,0.35)] focus:outline-none transition rounded-xl" />
                <button onClick={send} disabled={!draft.trim()}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center bg-[#E8724A] text-white transition hover:bg-[#FF8B6A] active:scale-90 disabled:opacity-30 rounded-xl" style={{ boxShadow: "0 4px 14px rgba(232,114,74,0.30)" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center gap-3 text-white/24">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="opacity-30">
              <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[14px]">Konversation auswählen</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InboxPage() {
  return <Suspense><InboxContent /></Suspense>;
}
