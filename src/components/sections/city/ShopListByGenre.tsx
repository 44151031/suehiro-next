"use client";

import { useRef, useState } from "react";

type Shop = {
  name: string;
  address: string;
};

type Props = {
  genre: string;
  shops: Shop[];
};

export default function ShopListByGenre({ genre, shops }: Props) {
  const [expanded, setExpanded] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const threshold = 3;
  const showToggle = shops.length > threshold;
  const visibleShops = expanded ? shops : shops.slice(0, threshold);

  const toggle = () => {
    if (expanded && headingRef.current) {
      headingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setExpanded(!expanded);
  };

  return (
    <section className="space-y-4">
      <h2
        ref={headingRef}
        id={`genre-${genre}`}
        className="scroll-mt-28 text-xl sm:text-2xl font-semibold text-neutral-800 border-l-4 border-primary pl-4"
      >
        {genre}ジャンルの対象店舗
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        {visibleShops.map((shop, idx) => (
          <li
            key={idx}
            className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3"
          >
            <p className="font-semibold text-gray-900">{shop.name}</p>
            <p className="text-gray-600 text-sm">{shop.address}</p>
          </li>
        ))}
      </ul>

      {showToggle && (
        <div className="text-center mt-4">
          <button
            onClick={toggle}
            className="inline-block bg-primary text-white text-sm font-semibold rounded-full px-6 py-2 hover:bg-primary/90 transition"
          >
            {expanded ? "閉じる" : "さらに表示する"}
          </button>
        </div>
      )}
    </section>
  );
}
