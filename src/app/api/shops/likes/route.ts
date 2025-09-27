// /src/app/api/shops/likes/route.ts
import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shopid = searchParams.get("shopid");

  if (!shopid) {
    return NextResponse.json({ error: "shopid is required" }, { status: 400 });
  }

  const supabase = await createClientServer();

  // support_events を COUNT
  const { count, error } = await supabase
    .from("support_events")
    .select("*", { count: "exact", head: true })
    .eq("shopid", shopid);

  if (error) {
    console.error("COUNT API error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ shopid, likes: count ?? 0 });
}
