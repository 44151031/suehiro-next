// /components/sections/top/HeroTop.tsx

"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const slides = [
  {
    image: "/images/top/slide-top1.webp",
    title: "札幌市 最大30%還元",
    description: "PayPayでおトクに買い物",
    href: "/campaigns/hokkaido/sapporo",
  },
  {
    image: "/images/top/slide-top2.webp",
    title: "大阪市 商店街を応援しよう",
    description: "飲食店で使えるクーポン満載",
    href: "/campaigns/osaka/osaka",
  },
  {
    image: "/images/top/slide-top3.webp",
    title: "福岡市 対象店舗拡大中！",
    description: "日用品やランチにも使える",
    href: "/campaigns/fukuoka/fukuoka",
  },
  {
    image: "/images/top/slide-top4.webp",
    title: "名古屋市 最大25%還元",
    description: "小売・飲食・交通も対象",
    href: "/campaigns/aichi/nagoya",
  },
  {
    image: "/images/hero/slide5.webp",
    title: "仙台市 地元応援キャンペーン",
    description: "PayPayで地域貢献",
    href: "/campaigns/miyagi/sendai",
  },
];

export default function HeroTop() {
const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
  loop: true,
  mode: "snap",
  slides: {
    perView: 1.1,
    spacing: 16,
  },
  breakpoints: {
    "(min-width: 769px)": {
      slides: {
        perView: 2.5,
        spacing: 24,
      },
    },
    "(min-width: 1025px)": {
      slides: {
        perView: 4,
        spacing: 32,
      },
    },
  },
});

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-10 overflow-hidden">
      <div
        ref={sliderRef}
        className="keen-slider max-w-[100vw] px-6 sm:px-8 lg:px-12"
      >
        {slides.map((slide, idx) => (
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
            />
            <div className="absolute inset-0 bg-black/40 z-0" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 drop-shadow">
                {slide.title}
              </h2>
              {slide.description && (
                <p className="text-xs sm:text-sm md:text-base mb-2 text-white/90">
                  {slide.description}
                </p>
              )}
              <Link href={slide.href}>
                <Button variant="secondary" size="sm">
                  キャンペーンを見る
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
