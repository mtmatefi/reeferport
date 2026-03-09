import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { createSession, setSessionCookie, type SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "E-Mail und Passwort erforderlich." }, { status: 400 });
    }
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!user) {
      return NextResponse.json({ error: "E-Mail oder Passwort falsch." }, { status: 401 });
    }
    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "E-Mail oder Passwort falsch." }, { status: 401 });
    }
    const sessionUser: SessionUser = { id: user.id, email: user.email, name: user.name, avatar: user.avatar, type: user.type, location: user.location, verified: user.verified };
    const token = await createSession(sessionUser);
    await setSessionCookie(token);
    return NextResponse.json({ user: sessionUser });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server-Fehler." }, { status: 500 });
  }
}
