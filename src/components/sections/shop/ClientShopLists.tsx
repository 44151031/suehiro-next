// /src/components/sections/shop/ClientShopLists.tsx
// ✅ Egress削減版（詳細データfetch廃止、SSRから受け取り）

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";

// ✅ Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  /** ジャンル別の店舗リスト */
  shopListByGenre: Record<string, Shop[]>;
  /** SSRで取得済みの店舗詳細マップ */
  detailsMap: Record<string, ShopDetail>;
};

/**
 * ✅ Egress削減対応版
 * - Supabaseからランキングのみ取得
 * - 店舗詳細データはSSR側から受け取る（クライアントfetchなし）
 */
export default function ClientShopLists({ shopListByGenre, detailsMap }: Props) {
  const [ranking, setRanking] = useState<{ shopid: string; likes: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Supabaseからランキング取得（キャッシュ24h）
  const fetchRanking = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_shop_ranking");
      if (error) {
        console.error("❌ 応援数ランキングの取得に失敗:", error);
      } else if (data) {
        setRanking(data);
        localStorage.setItem(
          "shop_ranking_cache",
          JSON.stringify({
            timestamp: Date.now(),
            data,
          })
        );
      }
    } catch (e) {
      console.error("❌ ランキング取得中にエラー:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 初回ロード時：キャッシュ確認 → 24時間超過で再取得
  useEffect(() => {
    const cache = localStorage.getItem("shop_ranking_cache");
    const forceRefresh = false; // ← テスト時のみtrueにする

    if (cache && !forceRefresh) {
      try {
        const parsed = JSON.parse(cache);
        const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000; // 24h
        if (!isExpired && Array.isArray(parsed.data)) {
          setRanking(parsed.data);
          setIsLoading(false);
          return;
        }
      } catch {
        console.warn("⚠️ ローカルキャッシュ破損、再取得を行います");
      }
    }
    fetchRanking();
  }, []);

  return (
    <>
      {isLoading && (
        <p className="text-sm text-gray-600 mb-3 text-right">
          🔄 応援ランキングを取得中…
        </p>
      )}

      <GenreShopLists
        shopListByGenre={shopListByGenre}
        detailsMap={detailsMap}
        ranking={ranking}
      />
    </>
  );
}
