"use client";
import { useState } from "react";

const conversations = [
  { id: "c1", name: "Marc S.", avatar: "https://i.pravatar.cc/150?img=12", lastMessage: "Ich würde gerne die Torch abholen – passt Samstag?", time: "vor 12 Min", unread: 2, listing: "Dragon Soul Torch" },
  { id: "c2", name: "Nina B.", avatar: "https://i.pravatar.cc/150?img=25", lastMessage: "Danke, Koralle ist super angekommen!", time: "vor 2h", unread: 0, listing: "Ultra Zoanthus Garden" },
  { id: "c3", name: "CoralHaus Luzern", avatar: "https://i.pravatar.cc/150?img=3", lastMessage: "Ja, wir haben noch 2 Frags. Bitte um kurze Voranmeldung.", time: "vor 1d", unread: 0, listing: "Maxima Clam Electric Blue" },
  { id: "c4", name: "ReefLab Zürich", avatar: "https://i.pravatar.cc/150?img=7", lastMessage: "Versand ist heute rausgegangen – Tracking: CH12345", time: "vor 3d", unread: 0, listing: "Acropora Tricolor Frag" },
];

const demoMessages = [
  { id: 1, from: "other", text: "Hallo! Ich interessiere mich für Ihr Inserat. Ist das noch verfügbar?", time: "10:24" },
  { id: 2, from: "me", text: "Ja, das Inserat ist noch verfügbar! Gerne können wir einen Termin vereinbaren.", time: "10:31" },
];

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeConv = conversations.find((c) => c.id === activeId);

  // Desktop: show both panels side by side; Mobile: show one at a time
  return (
    <div className="pb-28 md:pb-0">
      {/* Header */}
      <div className="border-b border-white/8 px-4 sm:px-6 lg:px-8 pb-4 pt-6">
        <h1 className="text-[22px] font-semibold tracking-[-0.04em]">Nachrichten</h1>
        <p className="mt-0.5 text-[14px] text-white/40">
          {conversations.filter((c) => c.unread > 0).length} ungelesene Nachrichten
        </p>
      </div>

      {/* Two-panel layout on md+ */}
      <div className="md:grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] md:h-[calc(100vh-120px)]">

        {/* Conversation list */}
        <div className={`border-r border-white/6 overflow-y-auto ${activeId ? "hidden md:block" : "block"}`}>
          <div className="divide-y divide-white/6">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={["flex w-full items-start gap-4 px-4 sm:px-5 py-4 text-left transition", conv.id === activeId ? "bg-white/6" : "hover:bg-white/3"].join(" ")}
              >
                <div className="relative shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="h-11 w-11 rounded-full object-cover" />
                  {conv.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#60A5FA] text-[9px] font-semibold text-black">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-[15px] font-semibold ${conv.unread > 0 ? "text-white" : "text-white/80"}`}>{conv.name}</span>
                    <span className="shrink-0 text-[12px] text-white/32">{conv.time}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-white/38">{conv.listing}</p>
                  <p className={`mt-1 truncate text-[13px] leading-snug ${conv.unread > 0 ? "text-white/72 font-medium" : "text-white/42"}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        {activeConv ? (
          <div className={`flex flex-col ${activeId ? "flex" : "hidden md:flex"}`}>
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-white/8 px-4 sm:px-6 py-3.5">
              <button onClick={() => setActiveId(null)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 md:hidden">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <img src={activeConv.avatar} alt={activeConv.name} className="h-8 w-8 rounded-full object-cover" />
              <div>
                <div className="text-[15px] font-semibold">{activeConv.name}</div>
                <div className="text-[12px] text-white/38">{activeConv.listing}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 sm:px-6 py-5">
              {demoMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] px-4 py-3 ${msg.from === "me" ? "rounded-l-xl rounded-br-xl bg-white/14" : "rounded-r-xl rounded-bl-xl bg-white/8"}`}>
                    <p className="text-[14px] leading-relaxed text-white/82">{msg.text}</p>
                    <p className={`mt-1 text-[11px] text-white/30 ${msg.from === "me" ? "text-right" : ""}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="max-w-[78%] rounded-r-xl rounded-bl-xl bg-white/8 px-4 py-3">
                  <p className="text-[14px] leading-relaxed text-white/82">{activeConv.lastMessage}</p>
                  <p className="mt-1 text-[11px] text-white/30">{activeConv.time}</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/8 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nachricht..."
                  className="flex-1 border border-white/10 bg-white/4 px-4 py-3 text-[14px] text-white/86 placeholder-white/28 focus:border-white/24 focus:outline-none"
                />
                <button className="flex h-[46px] w-[46px] items-center justify-center bg-white text-black transition hover:bg-white/90">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center text-center text-white/36">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <p className="text-[14px]">Wähle eine Konversation aus</p>
          </div>
        )}
      </div>
    </div>
  );
}
