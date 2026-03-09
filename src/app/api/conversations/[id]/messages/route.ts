import { NextRequest, NextResponse } from "next/server";
import { db, messages, conversations } from "@/lib/db";
import { eq, asc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET /api/conversations/[id]/messages – fetch all messages, mark received as read
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const { id: convId } = await params;

  // Verify user is part of this conversation
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, convId))
    .limit(1);

  if (!conv || (conv.buyerId !== session.id && conv.sellerId !== session.id)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convId))
    .orderBy(asc(messages.createdAt));

  // Mark unread messages from the other party as read
  await db
    .update(messages)
    .set({ read: true })
    .where(and(
      eq(messages.conversationId, convId),
      eq(messages.read, false),
    ));

  return NextResponse.json(rows);
}

// POST /api/conversations/[id]/messages { text } – send a message
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login erforderlich" }, { status: 401 });

  const { id: convId } = await params;
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Nachricht darf nicht leer sein" }, { status: 400 });
  }

  // Verify user is part of this conversation
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, convId))
    .limit(1);

  if (!conv || (conv.buyerId !== session.id && conv.sellerId !== session.id)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const [msg] = await db
    .insert(messages)
    .values({ conversationId: convId, senderId: session.id, text: text.trim() })
    .returning();

  return NextResponse.json(msg);
}
