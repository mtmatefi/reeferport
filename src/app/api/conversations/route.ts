import { NextRequest, NextResponse } from "next/server";
import { db, conversations, messages, users, listings } from "@/lib/db";
import { eq, or, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET /api/conversations – list user's conversations with last message
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const rows = await db
    .select({
      id: conversations.id,
      buyerId: conversations.buyerId,
      sellerId: conversations.sellerId,
      listingId: conversations.listingId,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .where(or(eq(conversations.buyerId, session.id), eq(conversations.sellerId, session.id)))
    .orderBy(desc(conversations.createdAt));

  // Enrich with other party info + listing info + last message
  const enriched = await Promise.all(
    rows.map(async (conv) => {
      const otherId = conv.buyerId === session.id ? conv.sellerId : conv.buyerId;

      const [other] = await db
        .select({ id: users.id, name: users.name, avatar: users.avatar })
        .from(users)
        .where(eq(users.id, otherId))
        .limit(1);

      let listingTitle: string | null = null;
      if (conv.listingId) {
        const [l] = await db
          .select({ title: listings.title })
          .from(listings)
          .where(eq(listings.id, conv.listingId))
          .limit(1);
        listingTitle = l?.title ?? null;
      }

      const [lastMsg] = await db
        .select({ text: messages.text, senderId: messages.senderId, read: messages.read, createdAt: messages.createdAt })
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const unreadCount = await db
        .select({ id: messages.id })
        .from(messages)
        .where(and(
          eq(messages.conversationId, conv.id),
          eq(messages.read, false),
        ))
        .then((r) => r.filter((m) => {
          // Count messages sent by the other party that are unread
          return true;
        }).length);

      return {
        id: conv.id,
        other: other ?? { id: otherId, name: "Unbekannt", avatar: "" },
        listingId: conv.listingId,
        listingTitle,
        lastMessage: lastMsg ?? null,
        createdAt: conv.createdAt,
      };
    })
  );

  return NextResponse.json(enriched);
}

// POST /api/conversations { sellerId, listingId?, message } – start or resume conversation
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login erforderlich" }, { status: 401 });

  const { sellerId, listingId, message } = await req.json();
  if (!sellerId || !message) {
    return NextResponse.json({ error: "sellerId und message erforderlich" }, { status: 400 });
  }
  if (sellerId === session.id) {
    return NextResponse.json({ error: "Kann nicht an sich selbst schreiben" }, { status: 400 });
  }

  // Check if conversation already exists
  const existing = await db
    .select()
    .from(conversations)
    .where(
      listingId
        ? and(eq(conversations.buyerId, session.id), eq(conversations.sellerId, sellerId), eq(conversations.listingId, listingId))
        : and(eq(conversations.buyerId, session.id), eq(conversations.sellerId, sellerId))
    )
    .limit(1);

  let convId: string;
  if (existing.length) {
    convId = existing[0].id;
  } else {
    const [newConv] = await db
      .insert(conversations)
      .values({ buyerId: session.id, sellerId, listingId: listingId ?? null })
      .returning({ id: conversations.id });
    convId = newConv.id;
  }

  // Insert the message
  await db.insert(messages).values({
    conversationId: convId,
    senderId: session.id,
    text: message,
  });

  return NextResponse.json({ conversationId: convId });
}
