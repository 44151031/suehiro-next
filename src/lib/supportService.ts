// src/lib/supportService.ts
"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { getOrSetSessionId } from "@/lib/sessionClient";

const DAILY_LIMIT = 3;   // 1日の合計上限
const SHOP_LIMIT = 10;   // 1店舗の上限

function getTodayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// 1日の合計押し回数を取得
export async function getDailyCount() {
  const sid = getOrSetSessionId();
  const todayKey = getTodayKey();

  const { count, error } = await supabaseClient
    .from("support_events")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sid)
    .gte("created_at", todayKey);

  if (error) throw error;
  return count ?? 0;
}

// 店舗ごとのカウントを取得
export async function getShopCount(shopid: string) {
  const { count, error } = await supabaseClient
    .from("support_events")
    .select("*", { count: "exact", head: true })
    .eq("shopid", shopid);

  if (error) throw error;
  return count ?? 0;
}

// ♡を押す（トグル処理）
export async function toggleSupport(shopid: string) {
  const sid = getOrSetSessionId();
  const todayKey = getTodayKey();

  // 店舗ごとのカウント
  const shopCount = await getShopCount(shopid);
  if (shopCount >= SHOP_LIMIT) {
    return { status: "shop_limit" };
  }

  // 今日の合計カウント
  const dailyCount = await getDailyCount();
  if (dailyCount >= DAILY_LIMIT) {
    return { status: "daily_limit" };
  }

  // 既に今日その店に押してるか？
  const { data: existing, error: selectError } = await supabaseClient
    .from("support_events")
    .select("id")
    .eq("session_id", sid)
    .eq("shopid", shopid)
    .gte("created_at", todayKey)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existing) {
    // 取り消し（削除）
    const { error: delError } = await supabaseClient
      .from("support_events")
      .delete()
      .eq("id", existing.id);
    if (delError) throw delError;

    return { status: "removed" };
  }

  // 新規追加
  const { error: insertError } = await supabaseClient
    .from("support_events")
    .insert([{ session_id: sid, shopid }]);

  if (insertError) throw insertError;

  return { status: "added" };
}
