"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export interface Message {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  listing: string;
  listingId?: string;
  unread: number;
  messages: Message[];
}

interface StoreState {
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  conversations: Conversation[];
  sendMessage: (convId: string, text: string) => void;
  startConversation: (listingId: string, listingTitle: string, sellerName: string, sellerAvatar: string) => string;
  markRead: (convId: string) => void;
  totalUnread: number;
  notifications: number;
}

const StoreCtx = createContext<StoreState | null>(null);

const now = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const INITIAL_CONVS: Conversation[] = [
  {
    id: "c1",
    name: "Marc S.",
    avatar: "https://i.pravatar.cc/150?img=12",
    listing: "Dragon Soul Torch",
    listingId: "l1",
    unread: 2,
    messages: [
      { id: "m1", from: "other", text: "Hallo! Ist die Torch noch verfügbar?", time: "10:24" },
      { id: "m2", from: "me", text: "Ja, sie ist noch da! Wann passt es dir?", time: "10:31" },
      { id: "m3", from: "other", text: "Ich würde sie gerne abholen – passt Samstag?", time: "10:48" },
    ],
  },
  {
    id: "c2",
    name: "Nina B.",
    avatar: "https://i.pravatar.cc/150?img=25",
    listing: "Ultra Zoanthus Garden",
    listingId: "l3",
    unread: 0,
    messages: [
      { id: "m4", from: "me", text: "Verpackung war super, danke!", time: "Gestern" },
      { id: "m5", from: "other", text: "Danke, Koralle ist super angekommen! ❤️", time: "Gestern" },
    ],
  },
  {
    id: "c3",
    name: "CoralHaus Luzern",
    avatar: "https://i.pravatar.cc/150?img=3",
    listing: "Maxima Clam Electric Blue",
    listingId: "l6",
    unread: 0,
    messages: [
      { id: "m6", from: "me", text: "Haben Sie noch weitere Muscheln?", time: "Mo" },
      { id: "m7", from: "other", text: "Ja, wir haben noch 2 Frags. Bitte um kurze Voranmeldung.", time: "Mo" },
    ],
  },
  {
    id: "c4",
    name: "ReefLab Zürich",
    avatar: "https://i.pravatar.cc/150?img=7",
    listing: "Acropora Tricolor",
    listingId: "l4",
    unread: 0,
    messages: [
      { id: "m8", from: "other", text: "Versand ist heute rausgegangen – Tracking: CH83741", time: "Fr" },
    ],
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["l2", "l5"]));
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVS);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const sendMessage = useCallback((convId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const newMsg: Message = { id: Date.now().toString(), from: "me", text, time: now() };
        // Simulate reply after 1.5s
        setTimeout(() => {
          const replies = [
            "Danke für Ihre Nachricht! Ich melde mich bald.",
            "Super, das klingt gut! Wann passt es Ihnen?",
            "Gerne, ich halte das Inserat für Sie reserviert.",
            "Perfekt, freue mich auf die Übergabe!",
          ];
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            from: "other",
            text: replies[Math.floor(Math.random() * replies.length)],
            time: now(),
          };
          setConversations((p) =>
            p.map((c) => c.id === convId ? { ...c, messages: [...c.messages, reply] } : c)
          );
        }, 1500);
        return { ...c, messages: [...c.messages, newMsg], unread: 0 };
      })
    );
  }, []);

  const startConversation = useCallback((listingId: string, listingTitle: string, sellerName: string, sellerAvatar: string): string => {
    const existing = conversations.find((c) => c.listingId === listingId);
    if (existing) return existing.id;
    const id = `c-${Date.now()}`;
    const newConv: Conversation = {
      id,
      name: sellerName,
      avatar: sellerAvatar,
      listing: listingTitle,
      listingId,
      unread: 0,
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    return id;
  }, [conversations]);

  const markRead = useCallback((convId: string) => {
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, unread: 0 } : c)
    );
  }, []);

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <StoreCtx.Provider value={{ savedIds, toggleSaved, isSaved, conversations, sendMessage, startConversation, markRead, totalUnread, notifications: totalUnread }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
