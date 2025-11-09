// /src/hooks/useShopDetails.ts
// ✅ SSR・fetch前ログ出力・revalidate対応 完全体

export type ShopDetail = {
  shopid: string;
  name: string;
  address?: string;
  description?: string;
  paytypes?: string[];
  note?: string;
  homepage?: string;
  instagram?: string;
  x?: string;
  line?: string;
};

/**
 * public/data配下のショップ詳細JSONをサーバー側で取得（SSR）
 * @param jsonPath 例: `/data/fukushima-kitakata-paypay-shops.json`
 * @returns Record<string, ShopDetail> （shopidをキーとしたマップ）
 */
export async function getShopDetails(
  jsonPath: string
): Promise<Record<string, ShopDetail>> {
  try {
    const BASE_URL =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const url = `${BASE_URL}${jsonPath}`;
    if (process.env.NODE_ENV === "development") {
      console.log(`🧭 [getShopDetails] Fetching details from: ${url}`);
    }

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 24時間キャッシュ
      cache: "force-cache",
    });

    if (!res.ok) {
      console.warn(`⚠️ 店舗詳細JSONが見つかりません: ${url}`);
      return {};
    }

    const data: ShopDetail[] = await res.json();
    const map = Object.fromEntries(
      data
        .filter((item) => item && item.shopid)
        .map((item) => [item.shopid, item])
    );
    return map;
  } catch (error) {
    console.error("❌ ショップ詳細データの取得に失敗しました:", error);
    return {};
  }
}
