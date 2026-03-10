import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "E-Mail und Passwort erforderlich." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: "E-Mail oder Passwort falsch." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name ?? data.user.email!.split("@")[0],
        avatar: profile?.avatar ?? `https://i.pravatar.cc/150?u=${data.user.email}`,
        type: profile?.type ?? "Privat",
        location: profile?.location ?? "Schweiz",
        verified: profile?.verified ?? false,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server-Fehler." }, { status: 500 });
  }
}
