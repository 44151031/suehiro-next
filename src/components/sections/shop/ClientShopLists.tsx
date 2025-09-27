"use client";

import { useState, useEffect } from "react";
import { getShopRanking } from "@/app/actions/support";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import type { Shop } from "@/types/shop";

type Props = {
  shopListByGenre: Record<string, Shop[]>;
  detailsJsonPath: string;
};

export default function ClientShopLists({ shopListByGenre, detailsJsonPath }: Props) {
  const [sortMode, setSortMode] = useState<"default" | "support">("default");
  const [ranking, setRanking] = useState<{ shopid: string; likes: number }[]>([]);

  useEffect(() => {
    if (sortMode === "support") {
      (async () => {
        const data = await getShopRanking();
        setRanking(data);
      })();
    }
  }, [sortMode]);

  return (
    <>
      {/* ✅ ソート切り替え UI */}
      <div className="mb-4 flex justify-end">
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as "default" | "support")}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="default">通常順</option>
          <option value="support">応援順</option>
        </select>
      </div>

      <GenreShopLists
        shopListByGenre={shopListByGenre}
        detailsJsonPath={detailsJsonPath}
        sortMode={sortMode}
        ranking={ranking}
      />
    </>
  );
}
