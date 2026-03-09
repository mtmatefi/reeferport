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

    // Extract only known fields to prevent injection of arbitrary columns
    const values = {
      title:       body.title as string,
      latin:       (body.latin ?? "") as string,
      price:       (body.price ?? 0) as number,
      currency:    (body.currency ?? "CHF") as string,
      subtitle:    (body.subtitle ?? "") as string,
      description: body.description as string,
      location:    body.location as string,
      image:       body.image as string,
      images:      (body.images ?? []) as string[],
      category:    body.category as string,
      subcategory: (body.subcategory ?? null) as string | null,
      condition:   body.condition as string,
      listingType: (body.listingType ?? "C2C") as string,
      offerType:   (body.offerType ?? "sell") as string,
      tags:        (body.tags ?? []) as string[],
      badge:       (body.badge ?? null) as string | null,
      shipping:    (body.shipping ?? false) as boolean,
      shippingCost: (body.shippingCost ?? null) as number | null,
      pickup:      (body.pickup ?? true) as boolean,
      // CITES fields
      citesRequired: (body.citesRequired ?? false) as boolean,
      citesNumber:   (body.citesNumber ?? null) as string | null,
      citesAppendix: (body.citesAppendix ?? null) as string | null,
      citesSource:   (body.citesSource ?? null) as string | null,
      // Equipment-specific fields
      equipmentType: (body.equipmentType ?? null) as string | null,
      brand:         (body.brand ?? null) as string | null,
      wattage:       (body.wattage ?? null) as number | null,
      tankSizeMin:   (body.tankSizeMin ?? null) as number | null,
      tankSizeMax:   (body.tankSizeMax ?? null) as number | null,
      sellerId:      session.id,
    };

    const [listing] = await db.insert(listings).values(values).returning();
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
