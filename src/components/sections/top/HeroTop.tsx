"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeId, PayTypeLabels } from "@/lib/payType";

function truncate(text: string | undefined, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

// ← 追加：ローカル日付として解釈するヘルパー
function parseLocalDate(dateStr: string, endOfDay = false) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return endOfDay
    ? new Date(y, m - 1, d, 23, 59, 59, 999) // その日の終端
    : new Date(y, m - 1, d, 0, 0, 0, 0);     // その日の始端
}

export default function HeroTop() {
  const [slides, setSlides] = useState<
    {
      image: string;
      title: string;
      description: string;
      href: string;
      paytype?: PayTypeId;
    }[]
  >([]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1.1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 769px)": {
        slides: { perView: 2.5, spacing: 24 },
      },
      "(min-width: 1025px)": {
        slides: { perView: 4, spacing: 32 },
      },
    },
  });

  useEffect(() => {
    const now = new Date();

    // 現在有効（start<=now<=end(23:59:59.999)）
    const active = campaigns.filter((c) => {
      const sd = parseLocalDate(c.startDate, false);
      const ed = parseLocalDate(c.endDate, true);
      return sd <= now && ed >= now;
    });

    // 近日開始（今後30日以内に開始）※足りない分だけフォールバック
    const soon = campaigns
      .filter((c) => {
        const sd = parseLocalDate(c.startDate, false);
        const diff = sd.getTime() - now.getTime();
        return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000; // 30日以内
      })
      .sort((a, b) => parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime());

    // 表示候補の確定（最大5件）
    const pool = active.length >= 5 ? active : [...active, ...soon];
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);

    const formatted = shuffled.map((c) => ({
      image: `/images/campaigns/${c.prefectureSlug}-${c.citySlug}.webp`,
      title: truncate(c.campaigntitle ?? `${c.city}のキャンペーン`, 26),
      description: `${c.prefecture}${c.city}`,
      href: `/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`,
      paytype: c.paytype,
    }));

    setSlides(formatted);
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [slides, instanceRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current?.next) {
        try {
          instanceRef.current.next();
        } catch (e) {
          console.warn("スライダー移動エラー:", e);
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-10 overflow-hidden">
      <div ref={sliderRef} className="keen-slider max-w-[100vw] px-6 sm:px-8 lg:px-12">
        {slides.map((slide, idx) => {
          const paytypeLabel = slide.paytype ? PayTypeLabels[slide.paytype] ?? "" : "";
          return (
            <div
              key={idx}
              className="keen-slider__slide w-[90%] mx-auto lg:w-[487px] relative rounded-2xl overflow-hidden h-[195px] sm:h-[220px] md:h-[260px] shadow-xl"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 25vw"
                style={{ aspectRatio: "3/2" }}
                priority={idx === 0}
              />
              <noscript>
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </noscript>
              <div className="absolute inset-0 bg-black/40 z-0" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 drop-shadow">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base mb-2 text-white/90">{slide.description}</p>
                <Button asChild variant="secondary" size="sm">
                  <Link href={slide.href}>
                    {paytypeLabel ? `${paytypeLabel}キャンペーンを見る` : "キャンペーンを見る"}
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
