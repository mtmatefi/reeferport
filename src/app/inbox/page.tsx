"use client";
import { useState } from "react";

const conversations = [
  {
    id: "c1",
    name: "Marc S.",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Ich würde gerne die Torch abholen – passt Samstag?",
    time: "vor 12 Min",
    unread: 2,
    listing: "Dragon Soul Torch",
  },
  {
    id: "c2",
    name: "Nina B.",
    avatar: "https://i.pravatar.cc/150?img=25",
    lastMessage: "Danke, Koralle ist super angekommen!",
    time: "vor 2h",
    unread: 0,
    listing: "Ultra Zoanthus Garden",
  },
  {
    id: "c3",
    name: "CoralHaus Luzern",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Ja, wir haben noch 2 Frags. Bitte um kurze Voranmeldung.",
    time: "vor 1d",
    unread: 0,
    listing: "Maxima Clam Electric Blue",
  },
  {
    id: "c4",
    name: "ReefLab Zürich",
    avatar: "https://i.pravatar.cc/150?img=7",
    lastMessage: "Versand ist heute rausgegangen – Tracking: CH12345",
    time: "vor 3d",
    unread: 0,
    listing: "Acropora Tricolor Frag",
  },
];

export default function InboxPage() {
  const [active, setActive] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === active);

  if (active && activeConv) {
    return (
      <div className="flex h-full flex-col pb-24">
        {/* Chat header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/8 bg-[rgba(3,7,10,0.94)] px-5 py-4 backdrop-blur-xl">
          <button onClick={() => setActive(null)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
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
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div className="flex justify-start">
            <div className="max-w-[78%] rounded-r-xl rounded-bl-xl bg-white/8 px-4 py-3">
              <p className="text-[14px] leading-relaxed text-white/82">
                Hallo! Ich interessiere mich für Ihr Inserat. Ist das noch verfügbar?
              </p>
              <p className="mt-1 text-[11px] text-white/30">10:24</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[78%] rounded-l-xl rounded-br-xl bg-white/14 px-4 py-3">
              <p className="text-[14px] leading-relaxed text-white/90">
                Ja, das Inserat ist noch verfügbar! Gerne können wir einen Termin vereinbaren.
              </p>
              <p className="mt-1 text-right text-[11px] text-white/36">10:31</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[78%] rounded-r-xl rounded-bl-xl bg-white/8 px-4 py-3">
              <p className="text-[14px] leading-relaxed text-white/82">{activeConv.lastMessage}</p>
              <p className="mt-1 text-[11px] text-white/30">{activeConv.time}</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[rgba(3,7,10,0.95)] px-5 py-4 pb-8 backdrop-blur-xl">
          <div className="mx-auto flex max-w-sm items-center gap-3">
            <input
              type="text"
              placeholder="Nachricht..."
              className="flex-1 border border-white/10 bg-white/4 px-4 py-3 text-[14px] text-white/86 placeholder-white/28 focus:border-white/24 focus:outline-none"
            />
            <button className="flex h-[46px] w-[46px] items-center justify-center bg-white text-black">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="border-b border-white/8 px-5 pb-4 pt-6">
        <h1 className="text-[22px] font-semibold tracking-[-0.04em]">Nachrichten</h1>
        <p className="mt-0.5 text-[14px] text-white/40">{conversations.filter((c) => c.unread > 0).length} ungelesene Nachrichten</p>
      </div>

      {/* Conversation list */}
      <div className="divide-y divide-white/6">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setActive(conv.id)}
            className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-white/3"
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
                <span className={`text-[15px] font-semibold ${conv.unread > 0 ? "text-white" : "text-white/80"}`}>
                  {conv.name}
                </span>
                <span className="shrink-0 text-[12px] text-white/32">{conv.time}</span>
              </div>
              <p className="mt-0.5 text-[12px] text-white/40">{conv.listing}</p>
              <p className={`mt-1 truncate text-[14px] leading-snug ${conv.unread > 0 ? "text-white/72 font-medium" : "text-white/44"}`}>
                {conv.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
