import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ user: null });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email!,
      name: profile?.name ?? user.user_metadata?.name ?? user.email!.split("@")[0],
      avatar: profile?.avatar ?? user.user_metadata?.avatar ?? `https://i.pravatar.cc/150?u=${user.email}`,
      type: profile?.type ?? user.user_metadata?.type ?? "Privat",
      location: profile?.location ?? user.user_metadata?.location ?? "Schweiz",
      verified: profile?.verified ?? false,
      rating: profile?.rating ?? 0,
      reviewCount: profile?.review_count ?? 0,
      memberSince: profile?.member_since ?? new Date().getFullYear().toString(),
      salesCount: profile?.sales_count ?? 0,
      bio: profile?.bio ?? "",
    },
  });
}
