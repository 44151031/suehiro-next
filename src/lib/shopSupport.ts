import { supabase } from "./supabaseClient";

const DAILY_LIMIT = 3;
const SHOP_LIMIT = 10;

function getTodayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// 1日の合計押し回数を取得
export async function getDailyCount(userId: string) {
  const todayKey = getTodayKey();
  const { data, error } = await supabase
    .from("shop_supports")
    .select("count", { count: "exact" })
    .eq("user_id", userId)
    .eq("date", todayKey);
  if (error) throw error;
  return data?.length || 0;
}

// 店舗ごとのカウントを取得
export async function getShopCount(shopid: string) {
  const { data, error } = await supabase
    .from("shop_supports")
    .select("id", { count: "exact" })
    .eq("shopid", shopid);
  if (error) throw error;
  return data?.length || 0;
}

// ♡を押す
export async function toggleSupport(userId: string, shopid: string) {
  const todayKey = getTodayKey();

  // 店舗ごとのカウント
  const shopCount = await getShopCount(shopid);
  if (shopCount >= SHOP_LIMIT) {
    return { status: "shop_limit" };
  }

  // 今日の合計カウント
  const dailyCount = await getDailyCount(userId);
  if (dailyCount >= DAILY_LIMIT) {
    return { status: "daily_limit" };
  }

  // 既に今日その店に押してるか？
  const { data: existing } = await supabase
    .from("shop_supports")
    .select("id")
    .eq("user_id", userId)
    .eq("shopid", shopid)
    .eq("date", todayKey)
    .single();

  if (existing) {
    // 取り消し（削除）
    await supabase.from("shop_supports").delete().eq("id", existing.id);
    return { status: "removed" };
  }

  // 新規追加
  await supabase.from("shop_supports").insert([
    { user_id: userId, shopid, date: todayKey },
  ]);

  return { status: "added" };
}
