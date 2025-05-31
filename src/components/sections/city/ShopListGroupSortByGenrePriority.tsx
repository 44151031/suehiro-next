// /components/sections/city/ShopListGroupSortByGenrePriority.tsx

import ShopListByGenre from "./GroupedShopListByGenre";
import { sortGenresByPriority } from "@/lib/genreSortPriority";

type Shop = {
  name: string;
  address: string;
};

type Props = {
  shopList: Record<string, Shop[]>;
};

export default function ShopListGroup({ shopList }: Props) {
  const genres = sortGenresByPriority(Object.keys(shopList));

  return (
    <section className="mt-16 space-y-14">
      {genres.map((genre) => (
        <ShopListByGenre
          key={genre}
          genre={genre}
          shops={shopList[genre]}
        />
      ))}
    </section>
  );
}
