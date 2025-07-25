"use client";

import { useRef, useState } from "react";
import ShopList from "./ShopList";
import ShopDetailModal from "@/components/ui/modals/ShopDetailModal";
import { useShopDetails } from "@/hooks/useShopDetails";

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
  detailsJsonPath: string; // ✅ 必須化
};

export default function ShopListSection({
  genre,
  shops,
  detailsJsonPath,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [modalShop, setModalShop] = useState<ShopDetail | null>(null);

  const { detailsMap } = useShopDetails(detailsJsonPath); // ✅ 渡されたパスを使う

  const threshold = 6;
  const showToggle = shops.length > threshold;
  const visibleShops = expanded ? shops : shops.slice(0, threshold);

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
          <ShopList
            shops={visibleShops}
            detailsMap={detailsMap}
            onClickShop={(detail) => setModalShop(detail)}
          />

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
