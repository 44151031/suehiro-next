// components/sections/Hero.tsx

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
          全国PayPay自治体キャンペーン特集
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-12 text-white/90">
          あなたの街も対象かも？おトクなクーポンがすぐ見つかる
        </p>

        <Link href="/campaigns">
          <Button variant="secondary" size="lg" className="text-base sm:text-lg px-6 py-3 font-semibold">
            キャンペーン一覧を見る
          </Button>
        </Link>
      </div>

      {/* スマホ画像（PCでのみ表示） */}
      <div className="hidden md:block absolute right-8 bottom-0 max-w-xs lg:max-w-sm">
<Image
  src="/images/hero-phone.jpg"
  alt="スマホアプリイメージ"
  width={320}
  height={640}
  className="rounded-xl shadow-xl"
/>
      </div>
    </section>
  );
}