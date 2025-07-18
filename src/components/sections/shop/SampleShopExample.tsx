"use client";

import { useState } from "react";
import ShopDetailModal from "@/components/ui/modals/ShopDetailModal";
import { ShopDetail } from "@/types/shopDetails";
import { Shop } from "@/types/shop";

const dummyShop: Shop = {
  name: "Dummyパン",
  address: "ダミー町ダミー番地",
  shopid: "s001",
};

const dummyDetail: ShopDetail = {
  shopid: "s001",
  name: "Dummyパン",
  address: "ダミー市ダミー町1番地",
  tel: "00-0000-0000",
  description: "国産小麦100%の自家製パンを毎朝焼き上げています。無添加・無漂白で安心して食べられるやさしい味わい。",
  paytypes: ["PayPay", "auPay"],
  note: "前回のキャンペーンでは当店自慢のサンドウィッチが好評で。キャンペーン後も多くの方がリピートしてくださっています。",
  homepage: "https://dummy-bakery.jp",
  instagram: "https://www.instagram.com/dummybakery",
  x: "https://twitter.com/dummybakery",
  line: "https://lin.ee/dummyline",
  photo: "/images/shops/s001.jpg", // ✅ ここを追加
};

export default function SampleShopExample() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="mt-16 space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
        📌 掲載イメージ(カードをクリックすると詳細が開きます)
      </h3>
      <p className="text-sm text-gray-600">
        無料店舗掲載をされますと、このように掲載されます（※これは架空の例です）
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        <li
          onClick={() => setModalOpen(true)}
          className="rounded-lg px-4 py-3 transition border-2 border-pink-300 bg-white cursor-pointer hover:shadow-md hover:scale-[1.03] duration-200"
        >
          <div className="flex flex-wrap items-center gap-x-1">
            <p className="font-semibold text-gray-900">Dummyパン</p>
            <span className="text-xs text-gray-600">[詳細]</span>
          </div>
          <p className="text-gray-600 text-sm">ダミー町ダミー番地</p>
        </li>
      </ul>

      <ShopDetailModal open={modalOpen} onClose={() => setModalOpen(false)} shop={dummyDetail}>
        {/* ✅ LINE登録ボタンと補足文 */}
        <div className="mt-6 text-center">
          <a
            href="https://lin.ee/PwfONyl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition"
            data-gtm-click="sample-line-button"
          >
            📩 まずはLINEで友だち登録
          </a>
          <p className="text-xs text-gray-500 mt-2">
            よかったら<span className="text-rose-500 text-base font-bold">LINEから店舗情報</span>をお送りください。
          </p>
        </div>
      </ShopDetailModal>
    </section>
  );
}
