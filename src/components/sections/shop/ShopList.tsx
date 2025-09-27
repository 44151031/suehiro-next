"use client";

import { useRef, useState, useEffect } from "react";
import { useShopDetails } from "@/hooks/useShopDetails";
import ShopCard from "./ShopCard";

type Shop = { name: string; address?: string; shopid?: string };

type ShopDetail = {
  shopid: string;
  name: string;
  address: string;
  description: string;
  paytypes: string[];
  note?: string;
  homepage?: string;
  instagram?: string;
  x?: string;
  line?: string;
};

type Props = {
  genre: string;
  shops: Shop[];
  sortMode: "default" | "support";
  ranking: { shopid: string; likes_total: number }[];
};

export default function ShopList({ genre, shops, sortMode, ranking }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { detailsMap } = useShopDetails() || { detailsMap: {} };

  useEffect(() => setIsClient(true), []);

  const threshold = 12;
  const showToggle = shops?.length > threshold;
  const visibleShops = isClient && !expanded ? shops?.slice(0, threshold) : shops;

  // ✅ 並び替え処理
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
        <p className="text-gray-600 text-sm">公表されましたらこのページで紹介いたします。</p>
      ) : (
        <>
          {/* ✅ UI削除済み。ソートは親から渡された値を使うだけ */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm">
            {sortedShops.map((shop, idx) => {
              const detail =
                shop.shopid && detailsMap ? detailsMap[shop.shopid] : undefined;
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
