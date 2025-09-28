import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

export async function GET() {
  const supabase = await createClientServer();
  const sid = await getOrSetSessionId();

  const { data, error } = await supabase
    .from("supports")
    .select("shopid")
    .eq("session_id", sid)
    .gte("created_at", new Date().toISOString().slice(0, 10)); // 今日の日付でフィルタ

  if (error) {
    console.error("getUserSupportsToday error:", error);
    return NextResponse.json([], { status: 500 });
  }

  const shopIds = data.map((row) => row.shopid);
  return NextResponse.json(shopIds);
}
