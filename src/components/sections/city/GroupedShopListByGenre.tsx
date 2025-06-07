"use client";

import { useRef, useState, useEffect } from "react";
import ShopDetailModal from "@/components/ui/modals/ShopDetailModal";

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
  tel?: string;
};

type Props = {
  genre: string;
  shops: Shop[];
  prefecture: string;
  city: string;
};

export default function ShopListByGenre({ genre, shops, prefecture, city }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [detailsMap, setDetailsMap] = useState<Record<string, ShopDetail>>({});
  const [modalShop, setModalShop] = useState<ShopDetail | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const threshold = 6;
  const showToggle = shops.length > threshold;
  const visibleShops = expanded ? shops : shops.slice(0, threshold);

  const toggleExpanded = () => {
    if (expanded && headingRef.current) {
      headingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    const loadDetails = async () => {
      const safePref = prefecture || "dummy";
      const safeCity = city || "dummy";
      const path = `/data/shopsdetails/${safePref}-${safeCity}-shops-details.json`;

      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error("primary load failed");
        const data: ShopDetail[] = await res.json();
        const map = Object.fromEntries(data.map((item) => [item.shopid, item]));
        setDetailsMap(map);
      } catch (error) {
        console.warn("本番データ読み込み失敗。ダミーデータにフォールバックします。");

        const fallbackRes = await fetch("/data/shopsdetails/dummy-dummy-shops-details.json");
        if (fallbackRes.ok) {
          const fallbackData: ShopDetail[] = await fallbackRes.json();
          const fallbackMap = Object.fromEntries(fallbackData.map((item) => [item.shopid, item]));
          setDetailsMap(fallbackMap);
        } else {
          console.error("ダミーデータの読み込みにも失敗しました");
        }
      }
    };

    loadDetails();
  }, [prefecture, city]);

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
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {visibleShops.map((shop, idx) => {
              const detail = shop.shopid ? detailsMap[shop.shopid] : null;
              const isModalLink = !!detail;

              return (
                <li
                  key={idx}
                  onClick={() => isModalLink && setModalShop(detail)}
                  className={`rounded-lg px-4 py-3 transition border ${
                    isModalLink
                      ? "bg-white border-pink-300 border-2 cursor-pointer hover:shadow-md hover:scale-[1.03] duration-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-1">
                    <p className="font-semibold text-gray-900">{shop.name}</p>
                    {isModalLink && (
                      <span className="text-xs text-gray-600">[詳細]</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{shop.address}</p>
                </li>
              );
            })}
          </ul>

          {showToggle && (
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

      {modalShop && (
        <ShopDetailModal
          open={true}
          onClose={() => setModalShop(null)}
          shop={modalShop}
        />
      )}
    </section>
  );
}
