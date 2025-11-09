"use client";

import { useRef, useState, useEffect } from "react";
import ShopCard from "./ShopCard";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";

type Props = {
  genre: string;
  shops: Shop[];
  sortMode: "default" | "support";
  /** SSRから渡される店舗詳細データ */
  detailsMap: Record<string, ShopDetail>;
  /** Supabaseから取得した応援ランキング */
  ranking: { shopid: string; likes_total: number }[];
};

/**
 * ✅ Egress削減対応版 ShopList
 * - `useShopDetails` を削除（クライアントfetchなし）
 * - detailsMap（SSR取得済）から詳細を参照
 * - ♥応援数順のソート対応
 */
export default function ShopList({
  genre,
  shops,
  sortMode,
  detailsMap,
  ranking,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => setIsClient(true), []);

  const threshold = 12;
  const showToggle = shops?.length > threshold;
  const visibleShops = isClient && !expanded ? shops.slice(0, threshold) : shops;

  // ✅ 並び替え処理（♥応援順 or デフォルト）
  const sortedShops =
    sortMode === "support"
      ? [...visibleShops].sort((a, b) => {
          const rankA = a.shopid
            ? ranking.find((r) => r.shopid === a.shopid)?.likes_total ?? 0
            : 0;
          const rankB = b.shopid
            ? ranking.find((r) => r.shopid === b.shopid)?.likes_total ?? 0
            : 0;
          return rankB - rankA;
        })
      : visibleShops;

  const toggleExpanded = () => {
    if (expanded && headingRef.current) {
      headingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setExpanded((prev) => !prev);
  };

  return (
    <section className="space-y-4">
      <h2
        ref={headingRef}
        id={`genre-${genre}`}
        className="scroll-mt-40 text-xl sm:text-2xl font-semibold text-neutral-800 border-l-4 border-primary pl-4"
      >
        {genre}の対象店舗
      </h2>

      {!shops || shops.length === 0 ? (
        <p className="text-gray-600 text-sm">
          公表されましたらこのページで紹介いたします。
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm">
            {sortedShops.map((shop, idx) => {
              const detail = shop.shopid ? detailsMap?.[shop.shopid] : undefined;

              return (
                <ShopCard
                  key={shop.shopid ?? `${shop.name}-${idx}`}
                  shop={shop}
                  detail={detail}
                  onClick={() => {}}
                />
              );
            })}
          </ul>

          {showToggle && isClient && (
            <div className="text-center mt-4">
              <button
                onClick={toggleExpanded}
                className="inline-block bg-primary text-white text-sm font-semibold rounded-full px-6 py-2 hover:bg-primary/90 transition cursor-pointer"
              >
                {expanded ? "閉じる" : "さらに表示する"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
