"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: string;
  location: string;
  verified: boolean;
}

interface StoreState {
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  conversations: Conversation[];
  sendMessage: (convId: string, text: string) => void;
  startConversation: (listingId: string, listingTitle: string, sellerName: string, sellerAvatar: string, sellerId?: string, message?: string) => Promise<string>;
  markRead: (convId: string) => void;
  totalUnread: number;
  notifications: number;
  // Auth
  session: SessionUser | null;
  sessionLoading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
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
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["l2", "l5"]));
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVS);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setSession(data.user ?? null);
        if (data.user) {
          const savedRes = await fetch("/api/saved");
          if (savedRes.ok) {
            const ids: string[] = await savedRes.json();
            setSavedIds(new Set(ids));
          }
        }
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      if (sbSession?.user) {
        const meta = sbSession.user.user_metadata ?? {};
        setSession({
          id: sbSession.user.id,
          name: meta.name ?? sbSession.user.email ?? "",
          email: sbSession.user.email ?? "",
          avatar: meta.avatar ?? "",
          type: meta.type ?? "Privat",
          location: meta.location ?? "",
          verified: !!sbSession.user.email_confirmed_at,
        });
        setSessionLoading(false);
      } else {
        // Supabase has no session – fall back to JWT /api/auth/me
        refreshSession();
      }
    });

    // Also do initial check via JWT fallback
    refreshSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  const toggleSaved = useCallback(async (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
    } catch {
      // Revert optimistic update on failure
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  }, []);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const sendMessage = useCallback((convId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const newMsg: Message = { id: Date.now().toString(), from: "me", text, time: now() };
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

  const startConversation = useCallback(async (
    listingId: string,
    listingTitle: string,
    sellerName: string,
    sellerAvatar: string,
    sellerId?: string,
    message?: string,
  ): Promise<string> => {
    const existing = conversations.find((c) => c.listingId === listingId);
    if (existing) return existing.id;

    if (sellerId && message) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sellerId, listingId, message }),
        });
        if (res.ok) {
          const data = await res.json();
          const convId = data.conversationId;
          const newConv: Conversation = {
            id: convId,
            name: sellerName,
            avatar: sellerAvatar,
            listing: listingTitle,
            listingId,
            unread: 0,
            messages: [{ id: Date.now().toString(), from: "me", text: message, time: now() }],
          };
          setConversations((prev) => [newConv, ...prev]);
          return convId;
        }
      } catch {
        // fall through to local
      }
    }

    const id = `c-${Date.now()}`;
    const newConv: Conversation = {
      id,
      name: sellerName,
      avatar: sellerAvatar,
      listing: listingTitle,
      listingId,
      unread: 0,
      messages: message ? [{ id: Date.now().toString(), from: "me", text: message, time: now() }] : [],
    };
    setConversations((prev) => [newConv, ...prev]);
    return id;
  }, [conversations]);

  const markRead = useCallback((convId: string) => {
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, unread: 0 } : c)
    );
  }, []);

  const logout = useCallback(async () => {
    // Sign out from both Supabase and JWT session
    try { await supabase.auth.signOut(); } catch { /* ignore if Supabase unreachable */ }
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setSavedIds(new Set());
  }, []);

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <StoreCtx.Provider value={{
      savedIds, toggleSaved, isSaved,
      conversations, sendMessage, startConversation, markRead,
      totalUnread, notifications: totalUnread,
      session, sessionLoading, refreshSession, logout,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
