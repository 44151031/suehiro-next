// src/app/actions/support.ts
"use server";

import { createClientServer } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

/** 応援トグル処理（既存） */
export async function toggleSupport(shopid: string) {
  const supabase = await createClientServer();
  const sid = getOrSetSessionId();

  const { data, error } = await supabase.rpc("toggle_support", {
    p_shopid: shopid,
    p_session_id: sid,
  });

  if (error) {
    console.error("toggleSupport error:", error);
    return { ok: false, liked: false, likes: 0, message: "エラーが発生しました。" };
  }

  return data as { ok: boolean; liked: boolean; likes: number; message: string };
}

/** ランキング取得（shop_statsから） */
export async function getShopRanking() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("shop_stats")
    .select("shopid, likes_total")
    .order("likes_total", { ascending: false })
    .limit(100);

  if (error) {
    console.error("getShopRanking error:", error);
    return [];
  }
  return data ?? [];
}
