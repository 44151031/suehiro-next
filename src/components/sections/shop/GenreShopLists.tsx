"use client";

import ShopList from "./ShopList";
import { sortGenresByPriority } from "@/lib/genreSortPriority";
import type { Shop } from "@/types/shop";

type Props = {
  shopListByGenre: Record<string, Shop[]>;
  detailsJsonPath: string;
  ranking: { shopid: string; likes: number }[];
};

export default function GenreShopLists({
  shopListByGenre,
  detailsJsonPath,
  ranking,
}: Props) {
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
          />
        );
      })}
    </section>
  );
}
