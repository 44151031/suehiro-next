"use server";

import { createClientServer } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

/**
 * 応援ボタンのトグル処理
 * @param shopid - 応援対象の店舗ID
 * @returns { ok, liked, likes, message }
 */
export async function toggleSupport(shopid: string) {
  const supabase = await createClientServer();
  const sid = getOrSetSessionId();

  const { data, error } = await supabase.rpc("toggle_support", {
    p_shopid: shopid,
    p_session_id: sid,
  });

  if (error) {
    console.error("toggleSupport error:", error);
    return {
      ok: false,
      liked: false,
      likes: 0,
      message: "エラーが発生しました。時間をおいて再度お試しください。",
    };
  }

  return data as {
    ok: boolean;
    liked: boolean;
    likes: number;
    message: string;
  };
}

/**
 * 応援ランキングを取得
 * @returns { shopid, likes }[]
 */
export async function getShopRanking() {
  const supabase = await createClientServer();
  const { data, error } = await supabase.rpc("get_shop_ranking");

  if (error) {
    console.error("getShopRanking error:", error);
    return [];
  }
  return data as { shopid: string; likes: number }[];
}
