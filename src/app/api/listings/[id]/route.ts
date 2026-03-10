import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("listings")
      .select(`*, seller:profiles(id, name, avatar, type, location, verified, rating, review_count, member_since, sales_count, bio)`)
      .eq("id", id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

    // Increment view count (fire and forget)
    supabase.from("listings").update({ views: (data.views ?? 0) + 1 }).eq("id", id).then(() => {});

    return NextResponse.json({ ...data, postedAt: formatPostedAt(data.created_at) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("seller_id", user.id);

  if (error) return NextResponse.json({ error: "Nicht erlaubt" }, { status: 403 });
  return NextResponse.json({ ok: true });
}

function formatPostedAt(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (h < 1)  return "Gerade";
  if (h < 24) return `${h}h`;
  if (d < 7)  return `${d}d`;
  return new Date(date).toLocaleDateString("de-CH", { day: "numeric", month: "short" });
}
