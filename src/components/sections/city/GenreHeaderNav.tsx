"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { sortGenresByPriority } from "@/lib/genreSortPriority";
import { PayTypes, PayTypeId } from "@/lib/payType";

type Props = {
  genres: string[];
  paytypeLabel: string; // ✅ 追加
};

export default function GenreHeaderNav({ genres, paytypeLabel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const sortedGenres = sortGenresByPriority(genres);

  return (
    <div className="sticky top-[64px] z-40 select-none">
      <div className="bg-white rounded-b-2xl border-b border-l border-r border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* ✅ 左側の文言を動的に変更 */}
          <div className="text-sm font-semibold text-gray-600 shrink-0">
            <span className="text-base font-bold text-gray-800">{paytypeLabel}</span>
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
              {sortedGenres.map((genre) => (
                <GenreButton key={genre} label={genre} href={`#genre-${genre}`} />
              ))}
              <GenreButton label="ページトップ" href="#top" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
