"use client";

import { Shop } from "@/types/shop";
import { ShopDetail } from "@/types/shopDetails";
import { cn } from "@/lib/utils";

type Props = {
  shop: Shop;
  detail?: ShopDetail;
  onClick?: () => void;
};

export default function ShopCard({ shop, detail, onClick }: Props) {
  const isModalLink = !!detail;
  return isModalLink ? (
    <DummyLinkCard shop={shop} detail={detail} />
  ) : (
    <NormalShopCard shop={shop} onClick={onClick} />
  );
}

// ✅ リンク付きダミーカード（<details> 展開型／押せる見た目に調整）
function DummyLinkCard({ shop, detail }: { shop: Shop; detail: ShopDetail }) {
  const baseClass =
    "rounded-lg px-3 py-[6px] sm:px-4 sm:py-3 mb-1 sm:mb-0 border-2 border-pink-300 bg-white transition duration-200";

  return (
    <details className={baseClass}>
      <summary
        className={cn(
          "list-none marker:hidden cursor-pointer",
          "hover:bg-pink-50 active:shadow-inner hover:shadow-md hover:scale-[1.02]",
          "rounded-md px-1 sm:px-2 py-1 sm:py-[6px] transition duration-150 ease-in-out"
        )}
      >
        {/* スマホ1行、PC縦並び */}
        <div className="sm:hidden flex flex-wrap items-center gap-x-1 leading-normal">
          <p className="font-semibold text-gray-900 text-xs">{shop.name}</p>
          {shop.address && (
            <p className="text-gray-600 text-[11px] leading-normal">{shop.address}</p>
          )}
          <span className="text-[10px] text-gray-600">[詳細]</span>
        </div>

        <div className="hidden sm:block">
          <div className="flex flex-wrap items-center gap-x-1 leading-normal">
            <p className="font-semibold text-gray-900 text-sm">{shop.name}</p>
            <span className="text-xs text-gray-600">[詳細]</span>
          </div>
          <p className="text-gray-600 text-sm leading-normal pb-[2px]">
            {shop.address}
          </p>
        </div>
      </summary>

      <div className="mt-1.5 text-xs sm:text-sm text-gray-700 space-y-1">
        {detail.description && <p>{detail.description}</p>}
        {detail.note && (
          <p className="text-[10px] sm:text-xs text-gray-500">{detail.note}</p>
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
    </details>
  );
}

// ✅ 通常の店舗カード（タップできそうに見えないデザインに調整）
function NormalShopCard({
  shop,
  onClick,
}: {
  shop: Shop;
  onClick?: () => void;
}) {
  const baseClass = `rounded-lg px-3 py-[5px] sm:px-4 sm:py-3 mb-1 sm:mb-0 border bg-white border-gray-200 cursor-default`;

  return (
    <li className={baseClass}>
      <div className="sm:hidden flex flex-wrap items-center gap-x-1 leading-normal">
        <p className="font-semibold text-gray-800 text-xs">{shop.name}</p>
        {shop.address && (
          <p className="text-gray-600 text-[11px] leading-normal">{shop.address}</p>
        )}
      </div>

      <div className="hidden sm:block">
        <p className="font-semibold text-gray-800 text-sm">{shop.name}</p>
        <p className="text-gray-600 text-sm leading-normal pb-[2px]">
          {shop.address}
        </p>
      </div>
    </li>
  );
}
