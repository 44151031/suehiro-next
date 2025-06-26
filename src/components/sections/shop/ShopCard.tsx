"use client";

import { Shop } from "@/types/shop";
import { ShopDetail } from "@/types/shopDetails";

type Props = {
  shop: Shop;
  detail?: ShopDetail;
  onClick: () => void;
};

export default function ShopCard({ shop, detail, onClick }: Props) {
  const isModalLink = !!detail;

  return (
    <li
      onClick={isModalLink ? onClick : undefined}
      className={`rounded-lg px-3 py-2 transition border ${
        isModalLink
          ? "bg-white border-pink-300 border-2 cursor-pointer hover:shadow-md hover:scale-[1.03] duration-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-1">
        <p className="font-semibold text-gray-900 text-xs">{shop.name}</p>
        {isModalLink && (
          <span className="text-[10px] text-gray-600">[詳細]</span>
        )}
      </div>
      <p className="text-gray-600 text-[11px]">{shop.address}</p>
    </li>
  );
}
