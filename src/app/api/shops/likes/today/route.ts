// src/app/api/shops/likes/today/route.ts
import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

export async function GET() {
  const supabase = await createClientServer();
  const sid = await getOrSetSessionId();

  const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const start = new Date(`${todayJST}T00:00:00+09:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  // 応援の登録と同じCookieのセッション、JST日付で取得
  const { data, error } = await supabase
    .from("support_events")
    .select("shopid")
    .eq("session_id", sid)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());

  if (error) {
    console.error("getUserSupportsToday error:", error);
    return NextResponse.json([], { status: 500 });
  }

  const shopIds = data.map((row) => row.shopid);
  return NextResponse.json(shopIds, { headers: { "Cache-Control": "private, no-store" } });
}
