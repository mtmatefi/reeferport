import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  // 1. Try Supabase session from Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const sb = createServerClient();
      const { data: { user }, error } = await sb.auth.getUser(authHeader.replace("Bearer ", ""));
      if (!error && user) {
        const meta = user.user_metadata ?? {};
        return NextResponse.json({
          user: {
            id: user.id,
            name: meta.name ?? user.email ?? "",
            email: user.email ?? "",
            avatar: meta.avatar ?? "",
            type: meta.type ?? "Privat",
            location: meta.location ?? "",
            verified: !!user.email_confirmed_at,
          },
        });
      }
    } catch {
      // Supabase unreachable, fall through
    }
  }

  // 2. Fallback to existing JWT cookie session
  const user = await getSession();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
