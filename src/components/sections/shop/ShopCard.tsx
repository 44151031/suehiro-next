"use client";

import { Shop } from "@/types/shop";
import { ShopDetail } from "@/types/shopDetails";

type Props = {
  shop: Shop;
  detail?: ShopDetail;
  onClick?: () => void;
};

export default function ShopCard({ shop, detail, onClick }: Props) {
  const isModalLink = !!detail;
  const showExpandable =
    !!detail?.description ||
    !!detail?.note ||
    !!detail?.homepage ||
    !!detail?.line ||
    !!detail?.instagram;

  return showExpandable ? (
    <details
      className={`rounded-lg px-3 py-[6px] sm:px-4 sm:py-3 mb-2 sm:mb-0 transition border ${
        isModalLink
          ? "bg-white border-pink-300 border-2 hover:shadow-md hover:scale-[1.03] duration-200"
          : "bg-white border-gray-200"
      }`}
    >
      <summary
        className={`list-none marker:hidden ${
          isModalLink ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-1 leading-normal">
          <p className="font-semibold text-gray-900 text-xs sm:text-sm">
            {shop.name}
          </p>
          {isModalLink && (
            <span className="text-[10px] sm:text-xs text-gray-600">
              [詳細]
            </span>
          )}
        </div>
        <p className="text-gray-600 text-[11px] sm:text-sm leading-normal pb-[2px]">
          {shop.address}
        </p>
      </summary>

      {isModalLink && (
        <div className="mt-1.5 text-xs sm:text-sm text-gray-700 space-y-1">
          {detail.description && <p>{detail.description}</p>}
          {detail.note && (
            <p className="text-[10px] sm:text-xs text-gray-500">
              {detail.note}
            </p>
          )}

          <div className="space-x-2 mt-1 text-[10px] sm:text-xs">
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
  ) : (
    <li
      onClick={isModalLink && onClick ? onClick : undefined}
      className={`rounded-lg px-3 py-[5px] sm:mb-0 transition border ${
        isModalLink
          ? "bg-white border-pink-300 border-2 cursor-pointer hover:shadow-md hover:scale-[1.03] duration-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-1 leading-normal">
        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
          {shop.name}
        </p>
        {isModalLink && (
          <span className="text-[10px] sm:text-xs text-gray-600">
            [詳細]
          </span>
        )}
      </div>
      <p className="text-gray-600 text-[11px] sm:text-sm leading-normal pb-[2px]">
        {shop.address}
      </p>
    </li>
  );
}
