"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { campaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/common/CampaignCard";
import { isEndingSoon } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import type { Campaign } from "@/types/campaign";
import Button from "@/components/ui/Button/Button";

export default function EndingSoonCampaigns() {
  const endingSoon: Campaign[] = campaigns.filter((c) => isEndingSoon(c.endDate));
  const sorted = useSortedCampaignsByDistance(endingSoon);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
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

  const handleMouseUp = () => setIsDragging(false);
  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!sorted || sorted.length === 0) return null;

  return (
    <section className="w-full py-10 bg-[#eeeeee] text-secondary-foreground relative mt-6">
      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        {/* 見出し（他と統一） */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-8 text-neutral-800 dark:text-white drop-shadow-sm">
          まもなく終了のキャンペーン（近い順）
        </h2>

        {/* ナビゲーションボタン */}
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

          {/* カードリスト */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory bg-white rounded-xl px-6 sm:px-8 lg:px-10 py-6 gap-2 sm:gap-3 md:gap-4 scrollbar-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
          >
            {/* 左側余白 */}
            <div className="shrink-0 w-4 sm:w-6 md:w-8 snap-start" />

            {sorted.map((c) => (
              <Link
                key={`${c.prefectureSlug}-${c.citySlug}`}
                href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
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

            {/* 右側余白 */}
            <div className="shrink-0 w-4 sm:w-6 md:w-8" />
          </div>
        </div>

        {/* 一覧ボタン */}
        <div className="mt-6 text-center">
          <Button href="/campaigns">PayPay自治体キャンペーンを一覧で確認</Button>
        </div>
      </div>
    </section>
  );
}
