"use client";

import ShopList from "./ShopList";
import { sortGenresByPriority } from "@/lib/genreSortPriority";

type Shop = {
  name: string;
  address: string;
  shopid?: string;
};

type Props = {
  shopListByGenre: Record<string, Shop[]>;
  detailsJsonPath: string; // ✅ これを追加！
};

export default function GenreShopLists({ shopListByGenre }: Props) {
  const rawGenres = Object.keys(shopListByGenre);
  const sortedGenres = sortGenresByPriority(rawGenres);

  if (sortedGenres.length === 0) {
    return (
      <section className="text-gray-600 text-sm">
        対象店舗の情報は現在準備中です。
      </section>
    );
  }

  return (
    <section className="space-y-10">
      {sortedGenres.map((genre) => (
        <ShopList
          key={genre}
          genre={genre}
          shops={shopListByGenre[genre]}
        />
      ))}
    </section>
  );
}
