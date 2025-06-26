"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { sortGenresByPriority } from "@/lib/genreSortPriority";
import { PayTypeId, PayTypeBadgeMap } from "@/lib/payType";

type Props = {
  genres: string[];
  paytypeLabel: string;
  paytype: PayTypeId;
};

export default function GenreHeaderNav({ genres, paytypeLabel, paytype }: Props) {
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
  const paytypeColor = PayTypeBadgeMap[paytype]?.bg ?? "#333";

  return (
    <div className="sticky top-[64px] z-40 select-none">
      <div className="bg-white rounded-b-2xl border-b border-l border-r border-gray-200 shadow-sm">
        <div className="flex items-center px-4 py-3">
          <div className="text-sm font-semibold text-gray-600 shrink-0">
            <span className="text-sm sm:text-base font-bold" style={{ color: paytypeColor }}>
              {paytypeLabel}
            </span>
          </div>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing"
          >
            <div className="flex flex-nowrap gap-1 px-1">
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
        "mx-[1px] sm:mx-1 whitespace-nowrap text-xs sm:text-sm font-semibold px-2 sm:px-4 py-[5px] sm:py-2 rounded-full border",
        "border-pink-400 text-gray-800 bg-white hover:bg-pink-500 hover:text-white transition-colors"
      )}
    >
      {label}
    </Link>
  );
}
