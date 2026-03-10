import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, location, type } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, Passwort und Name sind erforderlich." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          location: location ?? "Schweiz",
          type: type ?? "Privat",
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        return NextResponse.json({ error: "Diese E-Mail ist bereits registriert." }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Registrierung fehlgeschlagen." }, { status: 400 });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email!,
        name,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        type: type ?? "Privat",
        location: location ?? "Schweiz",
        verified: false,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server-Fehler. Bitte versuche es erneut." }, { status: 500 });
  }
}
