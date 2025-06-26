"use client";

import { useRef, useState, useEffect } from "react";
import { useShopDetails } from "@/hooks/useShopDetails";
import ShopCard from "./ShopCard"; // ✅ 統合したカードを使う

type Shop = {
  name: string;
  address: string;
  shopid?: string;
};

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
};

export default function ShopList({ genre, shops }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { detailsMap } = useShopDetails();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const threshold = 12;
  const showToggle = shops.length > threshold;
  const visibleShops =
    isClient && !expanded ? shops.slice(0, threshold) : shops;

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

      {shops.length === 0 ? (
        <p className="text-gray-600 text-sm">
          公表されましたらこのページで紹介いたします。
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm">
            {visibleShops.map((shop, idx) => {
              const detail = shop.shopid ? detailsMap[shop.shopid] : undefined;
              return (
                <ShopCard
                  key={idx}
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
