import { NextRequest, NextResponse } from "next/server";
import { db, listings, users } from "@/lib/db";
import { eq, desc, ilike, and, gte, lte, or, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET /api/listings?q=&category=&min=&max=&type=&seller=&sort=
export async function GET(req: NextRequest) {
  try {
    const { searchParams: p } = req.nextUrl;
    const q        = p.get("q") ?? "";
    const category = p.get("category") ?? "";
    const min      = p.get("min") ? Number(p.get("min")) : undefined;
    const max      = p.get("max") ? Number(p.get("max")) : undefined;
    const type     = p.get("type") ?? "";  // B2C | C2C
    const sellerId = p.get("seller") ?? "";
    const sort     = p.get("sort") ?? "newest";

    const filters = [eq(listings.active, true)];
    if (q)        filters.push(or(ilike(listings.title, `%${q}%`), ilike(listings.latin, `%${q}%`), ilike(listings.location, `%${q}%`), sql`${listings.tags}::text ilike ${'%' + q + '%'}`)!);
    if (category) filters.push(eq(listings.category, category));
    if (type)     filters.push(eq(listings.listingType, type));
    if (sellerId) filters.push(eq(listings.sellerId, sellerId));
    if (min !== undefined) filters.push(gte(listings.price, min));
    if (max !== undefined) filters.push(lte(listings.price, max));

    const rows = await db
      .select({
        listing: listings,
        seller: { id: users.id, name: users.name, avatar: users.avatar, type: users.type, location: users.location, verified: users.verified, rating: users.rating, reviewCount: users.reviewCount, memberSince: users.memberSince, salesCount: users.salesCount },
      })
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(and(...filters))
      .orderBy(
        sort === "price_asc"  ? listings.price :
        sort === "price_desc" ? sql`${listings.price} desc` :
        sort === "popular"    ? sql`${listings.views} desc` :
                                desc(listings.createdAt)
      )
      .limit(100);

    const result = rows.map(({ listing, seller }) => ({
      ...listing,
      seller,
      postedAt: formatPostedAt(listing.createdAt),
    }));

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

// POST /api/listings – create
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  try {
    const body = await req.json();
    const [listing] = await db.insert(listings).values({
      ...body,
      sellerId: session.id,
    }).returning();
    return NextResponse.json(listing, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
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
