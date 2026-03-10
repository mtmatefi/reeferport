import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/conversations – list user's conversations
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const { data: convs } = await supabase
    .from("conversations")
    .select(`
      id, listing_id, buyer_id, seller_id, created_at,
      buyer:profiles!conversations_buyer_id_fkey(id, name, avatar),
      seller:profiles!conversations_seller_id_fkey(id, name, avatar),
      listing:listings(title)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  return NextResponse.json(convs ?? []);
}

// POST /api/conversations { sellerId, listingId?, message }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login erforderlich" }, { status: 401 });

  const { sellerId, listingId, message } = await req.json();
  if (!sellerId || !message) {
    return NextResponse.json({ error: "sellerId und message erforderlich" }, { status: 400 });
  }
  if (sellerId === user.id) {
    return NextResponse.json({ error: "Kann nicht an sich selbst schreiben" }, { status: 400 });
  }

  // Check if conversation already exists
  let query = supabase
    .from("conversations")
    .select("id")
    .eq("buyer_id", user.id)
    .eq("seller_id", sellerId);
  if (listingId) query = query.eq("listing_id", listingId);

  const { data: existing } = await query.maybeSingle();

  let convId: string;
  if (existing) {
    convId = existing.id;
  } else {
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({ buyer_id: user.id, seller_id: sellerId, listing_id: listingId ?? null })
      .select("id")
      .single();
    if (error || !newConv) return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 });
    convId = newConv.id;
  }

  await supabase.from("messages").insert({
    conversation_id: convId,
    sender_id: user.id,
    text: message,
  });

  return NextResponse.json({ conversationId: convId });
}
