"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import type { Shop } from "@/types/shop";

// ✅ Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  shopListByGenre: Record<string, Shop[]>;
  detailsJsonPath: string;
};

export default function ClientShopLists({ shopListByGenre, detailsJsonPath }: Props) {
  const [ranking, setRanking] = useState<{ shopid: string; likes: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Supabaseからランキングを取得
  const fetchRanking = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_shop_ranking");
      if (error) {
        console.error("❌ 応援数ランキングの取得に失敗:", error);
      } else if (data) {
        setRanking(data);
        // ローカルキャッシュに保存（timestamp付き）
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

  // ✅ 初期ロード時：キャッシュ確認 → 24時間経過で更新
  useEffect(() => {
    const cache = localStorage.getItem("shop_ranking_cache");

    // 🧪 テスト中はキャッシュを無効化（即最新ランキングを取得）
    const forceRefresh = false; // ← true にすると毎回 Supabase にアクセス（確認用）

    if (cache && !forceRefresh) {
      const parsed = JSON.parse(cache);
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000; // 24時間
      if (!isExpired) {
        setRanking(parsed.data);
        setIsLoading(false);
        return; // キャッシュが有効ならSupabaseアクセス不要
      }
    }

    // キャッシュがない or 期限切れ → 再取得
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
        detailsJsonPath={detailsJsonPath}
        ranking={ranking}
      />
    </>
  );
}
