import { NextRequest, NextResponse } from "next/server";
import { db, listings, users } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [row] = await db
      .select({
        listing: listings,
        seller: { id: users.id, name: users.name, avatar: users.avatar, type: users.type, location: users.location, verified: users.verified, rating: users.rating, reviewCount: users.reviewCount, memberSince: users.memberSince, salesCount: users.salesCount },
      })
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(eq(listings.id, id))
      .limit(1);

    if (!row) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

    // Increment view count (fire and forget)
    db.update(listings).set({ views: sql`${listings.views} + 1` }).where(eq(listings.id, id)).catch(() => {});

    return NextResponse.json({
      ...row.listing,
      seller: row.seller,
      postedAt: formatPostedAt(row.listing.createdAt),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  const { id } = await params;
  const [listing] = await db.select({ sellerId: listings.sellerId }).from(listings).where(eq(listings.id, id)).limit(1);
  if (!listing || listing.sellerId !== session.id) return NextResponse.json({ error: "Nicht erlaubt" }, { status: 403 });
  await db.delete(listings).where(eq(listings.id, id));
  return NextResponse.json({ ok: true });
}

function formatPostedAt(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (h < 1)  return "Gerade";
  if (h < 24) return `${h}h`;
  if (d < 7)  return `${d}d`;
  return new Date(date).toLocaleDateString("de-CH", { day: "numeric", month: "short" });
}
