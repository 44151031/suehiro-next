"use client";

import { useRef, useState, useEffect } from "react";
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
};

export default function ShopList({ genre, shops }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false); // ✅ SSRかクライアントか判定
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { detailsMap } = useShopDetails();

  useEffect(() => {
    setIsClient(true); // ✅ クライアントマウント後に切り替え
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
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {visibleShops.map((shop, idx) => {
              const detail = shop.shopid ? detailsMap[shop.shopid] : null;
              const isModalLink = !!detail;

              return (
                <li key={idx}>
                  <details
                    className={`rounded-lg px-4 py-3 transition border ${isModalLink
                      ? "bg-white border-pink-300 border-2 hover:shadow-md hover:scale-[1.03] duration-200"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <summary
                      className={`list-none marker:hidden ${isModalLink ? "cursor-pointer" : "cursor-default"
                        }`}
                    >
                      <div className="flex flex-wrap items-center gap-x-1">
                        <p className="font-semibold text-gray-900">{shop.name}</p>
                        {isModalLink && (
                          <span className="text-xs text-gray-600">[詳細]</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{shop.address}</p>
                    </summary>

                    {isModalLink && detail && (
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        {detail.description && <p>{detail.description}</p>}
                        {detail.note && <p className="text-xs text-gray-500">{detail.note}</p>}

                        <div className="space-x-2 mt-1 text-xs">
                          {detail.homepage && (
                            <a
                              href={detail.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              ホームページ
                            </a>
                          )}
                          {detail.line && (
                            <a
                              href={detail.line}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 underline"
                            >
                              LINE
                            </a>
                          )}
                          {detail.instagram && (
                            <a
                              href={detail.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-500 underline"
                            >
                              Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </details>
                </li>
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
