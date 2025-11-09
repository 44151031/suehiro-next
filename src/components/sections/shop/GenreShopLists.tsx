"use client";

import ShopList from "./ShopList";
import { sortGenresByPriority } from "@/lib/genreSortPriority";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";

type Props = {
  /** ジャンル別店舗リスト */
  shopListByGenre: Record<string, Shop[]>;
  /** SSRで取得済みの店舗詳細データマップ */
  detailsMap: Record<string, ShopDetail>;
  /** Supabaseから取得した応援ランキング */
  ranking: { shopid: string; likes: number }[];
};

/**
 * ジャンルごとの店舗リストを表示（Egress削減版）
 * - 各ジャンルごとにShopListを呼び出す
 * - 応援数（likes）順に並び替え
 * - detailsMapはSSRで取得済みを利用（クライアントfetchなし）
 */
export default function GenreShopLists({
  shopListByGenre,
  detailsMap,
  ranking,
}: Props) {
  if (!shopListByGenre || Object.keys(shopListByGenre).length === 0) {
    return (
      <p className="text-gray-700 text-base">
        現時点では店舗情報が登録されていません。
      </p>
    );
  }

  const rawGenres = Object.keys(shopListByGenre);
  const sortedGenres = sortGenresByPriority(rawGenres);

  return (
    <section className="space-y-10">
      {sortedGenres.map((genre) => {
        const shops = shopListByGenre[genre] || [];

        // ✅ 応援数順に並び替え（♥が多い順）
        const sortedShops = [...shops].sort((a, b) => {
          const likesA = ranking.find((r) => r.shopid === a.shopid)?.likes ?? 0;
          const likesB = ranking.find((r) => r.shopid === b.shopid)?.likes ?? 0;
          return likesB - likesA;
        });

        return (
          <ShopList
            key={genre}
            genre={genre}
            shops={sortedShops}
            detailsMap={detailsMap}
            ranking={ranking}
          />
        );
      })}
    </section>
  );
}
