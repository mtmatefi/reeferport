import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/conversations/[id]/messages
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const { id: convId } = await params;

  // Verify user is part of this conversation
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", convId)
    .maybeSingle();

  if (!conv || (conv.buyer_id !== user.id && conv.seller_id !== user.id)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const { data: rows } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true });

  return NextResponse.json(rows ?? []);
}

// POST /api/conversations/[id]/messages { text }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login erforderlich" }, { status: 401 });

  const { id: convId } = await params;
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Nachricht darf nicht leer sein" }, { status: 400 });
  }

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", convId)
    .maybeSingle();

  if (!conv || (conv.buyer_id !== user.id && conv.seller_id !== user.id)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const { data: msg, error } = await supabase
    .from("messages")
    .insert({ conversation_id: convId, sender_id: user.id, text: text.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Fehler beim Senden" }, { status: 500 });
  return NextResponse.json(msg);
}
