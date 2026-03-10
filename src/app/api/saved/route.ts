import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/saved – get user's saved listing IDs
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([]);

  const { data } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", user.id);

  return NextResponse.json((data ?? []).map((r) => r.listing_id));
}

// POST /api/saved { listingId } – toggle saved
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login erforderlich" }, { status: 401 });

  const { listingId } = await req.json();

  const { data: existing } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_listings").delete().eq("user_id", user.id).eq("listing_id", listingId);
    return NextResponse.json({ saved: false });
  } else {
    await supabase.from("saved_listings").insert({ user_id: user.id, listing_id: listingId });
    return NextResponse.json({ saved: true });
  }
}
