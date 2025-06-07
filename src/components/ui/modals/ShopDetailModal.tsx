"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ShopDetail = {
  shopid: string;
  name: string;
  address: string;
  tel?: string;
  description: string;
  paytypes: string[];
  note?: string;
  homepage?: string;
  instagram?: string;
  x?: string;
  line?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  shop: ShopDetail;
  children?: React.ReactNode; // ✅ childrenを追加
};

export default function ShopDetailModal({ open, onClose, shop, children }: Props) {
  const imagePath = `/images/shops/fukushima-kitakata/${shop.shopid}.jpg`;
  const mapUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(shop.address)}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
            {shop.name}
          </DialogTitle>

          <p className="text-sm text-gray-600 mt-1">
            {shop.address}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 underline ml-1"
            >
              [Map]
            </a>
            {shop.tel && (
              <span className="ml-3 text-sm text-gray-700">
                電話：
                <a
                  href={`tel:${shop.tel}`}
                  className="underline text-blue-700 ml-1"
                >
                  {shop.tel}
                </a>
              </span>
            )}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="w-full aspect-video relative rounded-xl overflow-hidden border">
            <Image
              src={imagePath}
              alt={shop.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
              priority
            />
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-line">
            {shop.description}
          </p>

          <div className="text-sm text-gray-800">
            <div className="mt-3">
              <span className="font-semibold">対応キャッシュレス：</span>
              {shop.paytypes.join(" / ")}
            </div>
            {shop.note && (
              <div className="mt-2 text-gray-600 border-l-4 pl-3 border-yellow-300 italic">
                {shop.note}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            {shop.homepage && (
              <a
                href={shop.homepage}
                target="_blank"
                className="underline text-blue-600"
              >
                公式HP
              </a>
            )}
            {shop.instagram && (
              <a
                href={shop.instagram}
                target="_blank"
                className="underline text-pink-500"
              >
                Instagram
              </a>
            )}
            {shop.x && (
              <a
                href={shop.x}
                target="_blank"
                className="underline text-blue-400"
              >
                X (旧Twitter)
              </a>
            )}
            {shop.line && (
              <a
                href={shop.line}
                target="_blank"
                className="underline text-green-500"
              >
                LINE
              </a>
            )}
          </div>

          {children && (
            <div className="pt-2 border-t mt-4">
              {children}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
