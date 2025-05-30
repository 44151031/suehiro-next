"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { sortGenresByPriority } from "@/lib/genreSortPriority"; // ✅ 並び替え関数をインポート

type Props = {
  genres: string[];
};

export default function GenreHeaderNav({ genres }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ✅ ドラッグ操作の開始
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  // ✅ ドラッグ中のスクロール操作
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // ✅ ドラッグ終了
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ✅ ジャンルを優先度順に並べ替え
  const sortedGenres = sortGenresByPriority(genres);

  return (
    <div className="sticky top-[64px] z-40 select-none">
      <div className="bg-white rounded-b-2xl border-b border-l border-r border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* 左側：固定テキスト */}
          <div className="text-sm font-semibold text-gray-600 shrink-0">
            対象店舗ジャンル
          </div>

          {/* 横スクロールエリア */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing"
          >
            <div className="flex flex-nowrap gap-4 px-1">
              {/* ✅ 優先度順に並べ替えたジャンルボタンを表示 */}
              {sortedGenres.map((genre) => (
                <GenreButton key={genre} label={genre} href={`#genre-${genre}`} />
              ))}

              {/* ✅ 最後に「ページトップへ戻る」ボタン */}
              <GenreButton label="ページトップ" href="#top" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ ジャンルボタンのUI
function GenreButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "mx-1 whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full border",
        "border-pink-400 text-gray-800 bg-white hover:bg-pink-500 hover:text-white transition-colors"
      )}
    >
      {label}
    </Link>
  );
}
