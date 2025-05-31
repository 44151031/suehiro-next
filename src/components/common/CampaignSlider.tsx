"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CampaignCard from "@/components/common/CampaignCard";
import type { Campaign } from "@/types/campaign";

type Props = {
  campaigns: Campaign[];
  title: string;
  bgColor?: string;
};

export default function ScopedCampaignSlider({
  campaigns,
  title,
  bgColor = "#ffffff",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    e.preventDefault(); // ⬅️ URLドラッグ防止
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ✅ ドラッグ解除の補足：ウィンドウ離脱もキャッチ
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!campaigns || campaigns.length === 0) return null;

  return (
    <section className="w-full py-10 relative mt-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-8 text-neutral-800 drop-shadow-sm">
          {title}
        </h2>

        <div className="relative">
          <button
            onClick={() => scrollByAmount(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 shadow-md rounded-full p-2 backdrop-blur-sm hidden md:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByAmount(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 shadow-md rounded-full p-2 backdrop-blur-sm hidden md:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory bg-white rounded-xl px-6 sm:px-8 lg:px-10 py-6 gap-2 sm:gap-3 md:gap-4 scrollbar-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
          >
            <div className="shrink-0 w-4 sm:w-6 md:w-8 snap-start" />

            {campaigns.map((c) => (
              <Link
                key={`${c.prefectureSlug}-${c.citySlug}`}
                href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
                draggable={false} // ⬅️ ここが重要
                className="shrink-0 snap-start w-[90%] sm:w-[260px] md:w-[280px] lg:w-[300px] transition-transform hover:scale-[1.02]"
              >
                <CampaignCard
                  prefecture={c.prefecture}
                  city={c.city}
                  offer={c.offer}
                  fullpoint={c.fullpoint}
                  startDate={c.startDate}
                  endDate={c.endDate}
                  period={
                    c.startDate && c.endDate
                      ? `${new Date(c.startDate).getMonth() + 1}月${new Date(c.startDate).getDate()}日〜${new Date(c.endDate).getMonth() + 1}月${new Date(c.endDate).getDate()}日`
                      : ""
                  }
                />
              </Link>
            ))}

            <div className="shrink-0 w-4 sm:w-6 md:w-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
