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
      name: profile?.name ?? user.email!.split("@")[0],
      avatar: profile?.avatar ?? `https://i.pravatar.cc/150?u=${user.email}`,
      type: profile?.type ?? "Privat",
      location: profile?.location ?? "Schweiz",
      verified: profile?.verified ?? false,
    },
  });
}
