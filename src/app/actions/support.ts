// src/app/actions/support.ts
"use server";

import { createClientServer } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

/** 応援トグル処理 */
export async function toggleSupport(shopid: string) {
  const supabase = await createClientServer();
  const sid = await getOrSetSessionId(); // ← await 必須

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
      message: "エラーが発生しました。",
    };
  }

  // ✅ Supabase の RPC は配列で返るので先頭を取り出す
  const result =
    data && Array.isArray(data) && data.length > 0 ? data[0] : null;

  if (!result) {
    return {
      ok: false,
      liked: false,
      likes: 0,
      message: "結果が取得できませんでした。",
    };
  }

  return result as {
    ok: boolean;
    liked: boolean;
    likes: number;
    message: string;
  };
}

/** 今日すでに応援した shopid 一覧を取得 */
export async function getUserSupportsToday(): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/shops/likes/today`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("getUserSupportsToday fetch error:", res.statusText);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error("getUserSupportsToday error:", err);
    return [];
  }
}

/** 店舗ランキングを取得 */
export async function getShopRanking(): Promise<{ shopid: string; likes: number }[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/shops/likes/ranking`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("getShopRanking fetch error:", res.statusText);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error("getShopRanking error:", err);
    return [];
  }
}
