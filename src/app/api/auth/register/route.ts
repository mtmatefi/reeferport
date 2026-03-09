import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { createSession, setSessionCookie, type SessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, location, type } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, Passwort und Name sind erforderlich." }, { status: 400 });
    }
    const exists = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (exists.length) {
      return NextResponse.json({ error: "Diese E-Mail ist bereits registriert." }, { status: 409 });
    }
    const passwordHash = await hash(password, 10);
    const [user] = await db.insert(users).values({
      email: email.toLowerCase(),
      passwordHash,
      name,
      location: location ?? "Schweiz",
      type: type ?? "Privat",
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    }).returning();

    const sessionUser: SessionUser = { id: user.id, email: user.email, name: user.name, avatar: user.avatar, type: user.type, location: user.location, verified: user.verified };
    const token = await createSession(sessionUser);
    await setSessionCookie(token);
    return NextResponse.json({ user: sessionUser });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server-Fehler. Bitte versuche es erneut." }, { status: 500 });
  }
}
