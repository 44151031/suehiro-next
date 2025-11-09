// /src/lib/loadShopList.ts
// ✅ Egress削減 + 全JSON構造対応 + ISR(24h) + ローカル動作対応 完全体

/**
 * 支払いタイプごとのショップリストJSONを読み込む（サーバーサイドfetch版）
 *
 * @param prefectureSlug - 例: "tokyo"
 * @param citySlug - 例: "shibuya"
 * @param paytype - 例: "paypay", "aupay", "rakutenpay", "dbarai", "aeonpay"
 * @returns Record<string, { name: string; address?: string }[]> （ジャンル別構造）
 */
export async function loadShopList(
  prefectureSlug: string,
  citySlug: string,
  paytype: string
): Promise<Record<string, { name: string; address?: string }[]>> {
  try {
    const BASE_URL =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const filePath = `/data/${prefectureSlug}-${citySlug}-${paytype}-shops.json`;
    const url = `${BASE_URL}${filePath}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`🧭 [loadShopList] Fetching shop list from: ${url}`);
    }

    // ✅ ISR + CDNキャッシュ付きfetch
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 24時間キャッシュ
      cache: "force-cache",
    });

    if (!res.ok) {
      console.warn(`⚠️ 店舗リストJSONが見つかりません: ${url}`);
      return {};
    }

    const raw = await res.json();

    // ✅ 構造自動判別
    let result: Record<string, { name: string; address?: string }[]> = {};

    if (Array.isArray(raw)) {
      // 単配列 → "全て"キーにまとめる
      result["全て"] = raw.filter((x) => x && x.name);
    } else if (typeof raw === "object" && raw !== null) {
      // ジャンル別構造 → そのままコピー
      for (const key of Object.keys(raw)) {
        const arr = raw[key];
        if (Array.isArray(arr)) {
          result[key] = arr.filter((x) => x && x.name);
        }
      }
    } else {
      console.warn("⚠️ 予期しないJSON構造:", raw);
      return {};
    }

    return result;
  } catch (error) {
    console.error("❌ 店舗リストの読み込みに失敗:", error);
    return {};
  }
}
