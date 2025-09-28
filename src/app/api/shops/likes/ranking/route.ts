import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("shop_likes_view") // 集計済みのビュー or 集計クエリ
    .select("shopid, likes")
    .order("likes", { ascending: false });

  if (error) {
    console.error("getShopRanking error:", error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data);
}
