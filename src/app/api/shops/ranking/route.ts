// /src/app/api/shops/ranking/route.ts
import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClientServer();

    const { data, error } = await supabase
      .from("shop_stats")
      .select("shopid, likes_total")
      .order("likes_total", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Ranking API error:", error);
      return NextResponse.json(
        { error: "ランキング取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
