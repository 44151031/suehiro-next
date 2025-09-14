// src/app/admin/logout/route.ts
import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClientServer();
  // SupabaseのセッションCookieを削除
  await supabase.auth.signOut();

  // /admin/login に戻す
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/admin/login", base), { status: 302 });
}
