// /src/components/sections/shop/ClientShopLists.tsx
// ✅ Egress削減版（詳細データfetch廃止、SSRから受け取り）

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";
import { getOrSetSessionId } from "@/lib/sessionClient";

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

/** JST の今日 00:00〜明日 00:00 を UTC ISO 文字列で返す */
function getJSTTodayRangeUTC() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const startJST = new Date(jst.getFullYear(), jst.getMonth(), jst.getDate());
  const endJST = new Date(startJST);
  endJST.setDate(endJST.getDate() + 1);
  return {
    start: new Date(startJST.getTime() - 9 * 60 * 60 * 1000).toISOString(),
    end: new Date(endJST.getTime() - 9 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * ✅ Egress削減対応版
 * - Supabaseクエリを2本に削減：ランキング取得 + 今日押し済み一括取得
 * - 店舗詳細データはSSR側から受け取る（クライアントfetchなし）
 * - ランキングは24h localStorage キャッシュ
 */
export default function ClientShopLists({ shopListByGenre, detailsMap }: Props) {
  const [ranking, setRanking] = useState<{ shopid: string; likes: number }[]>([]);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedShopIds, setLikedShopIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // ── 1. ランキング取得（24h localStorage キャッシュ）──────────────────
        let rankingData: { shopid: string; likes: number }[] = [];
        const cache = localStorage.getItem("shop_ranking_cache");

        if (cache) {
          try {
            const parsed = JSON.parse(cache);
            const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
            if (!isExpired && Array.isArray(parsed.data)) {
              rankingData = parsed.data;
            }
          } catch {
            console.warn("⚠️ ローカルキャッシュ破損、再取得します");
          }
        }

        if (rankingData.length === 0) {
          const { data, error } = await supabase.rpc("get_shop_ranking");
          if (error) {
            console.error("❌ 応援数ランキングの取得に失敗:", error);
          } else if (data) {
            rankingData = data;
            localStorage.setItem(
              "shop_ranking_cache",
              JSON.stringify({ timestamp: Date.now(), data: rankingData })
            );
          }
        }

        setRanking(rankingData);

        // likesMap を構築（shopid → likes 数）
        const map: Record<string, number> = {};
        rankingData.forEach((r) => { map[r.shopid] = r.likes; });
        setLikesMap(map);

        // ── 2. 今日押し済み店舗を一括取得（1クエリ）───────────────────────────
        const sid = getOrSetSessionId();
        if (sid) {
          const { start, end } = getJSTTodayRangeUTC();
          const { data: todayData, error: todayError } = await supabase
            .from("support_events")
            .select("shopid")
            .eq("session_id", sid)
            .gte("created_at", start)
            .lt("created_at", end);

          if (todayError) {
            console.error("❌ 今日の応援取得に失敗:", todayError);
          } else if (todayData) {
            setLikedShopIds(new Set(todayData.map((r) => r.shopid)));
          }
        }
      } catch (e) {
        console.error("❌ 初期化エラー:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
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
        likesMap={likesMap}
        likedShopIds={likedShopIds}
      />
    </>
  );
}
