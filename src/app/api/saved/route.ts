import { NextRequest, NextResponse } from "next/server";
import { db, savedListings, listings, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET /api/saved – get user's saved listings
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([]);
  const rows = await db
    .select({ listingId: savedListings.listingId })
    .from(savedListings)
    .where(eq(savedListings.userId, session.id));
  return NextResponse.json(rows.map((r) => r.listingId));
}

// POST /api/saved { listingId } – toggle saved
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login erforderlich" }, { status: 401 });
  const { listingId } = await req.json();

  const existing = await db
    .select()
    .from(savedListings)
    .where(and(eq(savedListings.userId, session.id), eq(savedListings.listingId, listingId)))
    .limit(1);

  if (existing.length) {
    await db.delete(savedListings).where(and(eq(savedListings.userId, session.id), eq(savedListings.listingId, listingId)));
    return NextResponse.json({ saved: false });
  } else {
    await db.insert(savedListings).values({ userId: session.id, listingId });
    return NextResponse.json({ saved: true });
  }
}
