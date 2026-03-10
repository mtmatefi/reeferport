import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/listings?q=&category=&subcategory=&min=&max=&listing_type=&seller=&sort=&condition=
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams: p } = req.nextUrl;
    const q            = p.get("q") ?? "";
    const category     = p.get("category") ?? "";
    const subcategory  = p.get("subcategory") ?? "";
    const min          = p.get("min") ? Number(p.get("min")) : undefined;
    const max          = p.get("max") ? Number(p.get("max")) : undefined;
    const listingType  = p.get("listing_type") ?? "";
    const sellerId     = p.get("seller") ?? "";
    const sort         = p.get("sort") ?? "newest";
    const condition    = p.get("condition") ?? "";

    let query = supabase
      .from("listings")
      .select(`
        *,
        seller:profiles(id, name, avatar, type, location, verified, rating, review_count, member_since, sales_count, bio)
      `)
      .eq("active", true);

    if (category) query = query.eq("category", category);
    if (subcategory) query = query.eq("subcategory", subcategory);
    if (listingType) query = query.eq("listing_type", listingType);
    if (sellerId) query = query.eq("seller_id", sellerId);
    if (condition) query = query.eq("condition", condition);
    if (min !== undefined) query = query.gte("price", min);
    if (max !== undefined) query = query.lte("price", max);
    if (q) query = query.or(`title.ilike.%${q}%,latin.ilike.%${q}%,location.ilike.%${q}%`);

    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else if (sort === "popular") query = query.order("views", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.limit(100);

    const { data, error } = await query;
    if (error) throw error;

    const result = (data ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      postedAt: formatPostedAt(row.created_at as string),
    }));

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

// POST /api/listings – create listing (with optional image upload)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") ?? "";
    let body: Record<string, unknown>;
    let imageUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const imageFile = form.get("image") as File | null;

      if (imageFile && imageFile.size > 0) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from("listing-images")
            .getPublicUrl(uploadData.path);
          imageUrl = publicUrl;
        }
      }

      body = {
        title: form.get("title") as string,
        latin: form.get("latin") as string ?? "",
        subtitle: form.get("subtitle") as string ?? "",
        price: Number(form.get("price") ?? 0),
        currency: form.get("currency") as string ?? "CHF",
        description: form.get("description") as string ?? "",
        location: form.get("location") as string ?? "",
        category: form.get("category") as string,
        subcategory: form.get("subcategory") as string ?? "",
        condition: form.get("condition") as string ?? "",
        listing_type: form.get("listing_type") as string ?? "Verkaufen",
        shipping: form.get("shipping") === "true",
        shipping_cost: form.get("shippingCost") ? Number(form.get("shippingCost")) : null,
        pickup: form.get("pickup") !== "false",
        tags: JSON.parse(form.get("tags") as string ?? "[]"),
        cites_relevant: form.get("cites_relevant") === "true",
        cites_appendix: form.get("cites_appendix") as string ?? null,
        cites_confirmed: form.get("cites_confirmed") === "true",
        cites_notes: form.get("cites_notes") as string ?? "",
      };
    } else {
      body = await req.json();
      imageUrl = (body.image as string) ?? "";
    }

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        ...body,
        seller_id: user.id,
        image: imageUrl || (body.image as string) || "",
        images: imageUrl ? [imageUrl, ...((body.images as string[]) ?? [])] : ((body.images as string[]) ?? []),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(listing, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}

function formatPostedAt(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (h < 1)  return "Gerade";
  if (h < 24) return `${h}h`;
  if (d < 7)  return `${d}d`;
  return new Date(date).toLocaleDateString("de-CH", { day: "numeric", month: "short" });
}
