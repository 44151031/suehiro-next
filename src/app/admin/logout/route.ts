// src/app/admin/logout/route.ts
import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  if (req.headers.get("origin") !== origin) return new NextResponse(null, { status: 403 });
  const supabase = await createClientServer();
  // SupabaseのセッションCookieを削除
  await supabase.auth.signOut();

  // /admin/login に戻す
  return NextResponse.redirect(new URL("/admin/login", origin), { status: 303 });
}
