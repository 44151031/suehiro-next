"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Shop = {
  name: string;
  address: string;
};

type ShopDetail = {
  name: string;
  description: string;
  image?: string;
  website?: string;
  instagram?: string;
  x?: string;
  line?: string;
};

type Props = {
  genre: string;
  shops: Shop[];
  shopDetails?: ShopDetail[];
};

export default function ShopListByGenre({
  genre,
  shops,
  shopDetails = [],
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedShop, setSelectedShop] = useState<ShopDetail | null>(null);
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

  const getDetail = (shopName: string) =>
    shopDetails.find((d) => d.name.trim() === shopName.trim());

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
              const detail = getDetail(shop.name);
              return (
                <li
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 space-y-1"
                >
                  <p className="font-semibold text-gray-900">{shop.name}</p>
                  <p className="text-gray-600 text-sm">
                    {shop.address}
                    {detail && (
                      <>
                        {" ｜ "}
                        <button
                          onClick={() => setSelectedShop(detail)}
                          className="text-primary underline inline"
                        >
                          店舗詳細
                        </button>
                      </>
                    )}
                  </p>
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

      {/* モーダル */}
      <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
        <DialogContent className="max-w-lg">
          {selectedShop && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedShop.name}</DialogTitle>
              </DialogHeader>

              {selectedShop.image && (
                <img
                  src={selectedShop.image}
                  alt={`${selectedShop.name}の画像`}
                  className="rounded-md mb-3"
                />
              )}

              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                {selectedShop.description}
              </p>

              <ul className="space-y-1 text-sm">
                {selectedShop.website && (
                  <li>
                    <a
                      href={selectedShop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      ホームページ
                    </a>
                  </li>
                )}
                {selectedShop.instagram && (
                  <li>
                    <a
                      href={selectedShop.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {selectedShop.x && (
                  <li>
                    <a
                      href={selectedShop.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      X（旧Twitter）
                    </a>
                  </li>
                )}
                {selectedShop.line && (
                  <li>
                    <a
                      href={selectedShop.line}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 px-3 py-1 bg-green-500 text-white rounded-full"
                    >
                      LINEで予約・問い合わせ
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
