'use client';

import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function MobileMenu({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-white animate-slideInFull flex flex-col">
      {/* ✕ボタン */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-700 text-3xl font-bold z-50"
        aria-label="閉じる"
      >
        ✕
      </button>

      {/* 上部ボタン */}
      <div className="mt-20 px-6 flex gap-4">
        <a
          href="https://lin.ee/PwfONyl"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-button line flex-1"
        >
          LINEお得情報
        </a>
        <a
          href="https://x.com/paycancampaign"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-button x flex-1"
        >
          Xでお得情報
        </a>
      </div>

      {/* メニュー */}
      <nav className="mt-10 px-6 space-y-6 text-lg font-medium text-gray-800">
        <Link href="/campaigns" onClick={onClose} className="block border-b pb-2 hover:text-red-600">
          全国のキャンペーン一覧
        </Link>
        <Link href="/management" onClick={onClose} className="block border-b pb-2 hover:text-red-600">
          運営について
        </Link>
        <Link href="/" onClick={onClose} className="block border-b pb-2 hover:text-red-600">
          ホーム
        </Link>
      </nav>

      {/* 下部リンク */}
      <div className="mt-auto px-6 pb-10 pt-10 space-y-4 text-sm text-gray-700">
        <a
          href="/campaigns/archive"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-red-600"
        >
          次回開催待ち一覧 <ExternalLink className="w-4 h-4" />
        </a>
        <p className="text-xs text-gray-400">© 2025 Payキャン</p>
      </div>
    </div>
  );
}
