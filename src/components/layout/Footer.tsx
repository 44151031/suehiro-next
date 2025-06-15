"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Twitter } from "lucide-react";
import { prefectures } from "@/lib/prefectures";
import { popularSearches } from "@/lib/popularSearches";
import Container from "@/components/layout/Container";

export default function Footer() {
  const [showPrefectures, setShowPrefectures] = useState(false);
  const excludedSlugs = ["tottori", "kochi", "okinawa"];

  const group1 = ["北海道・東北", "関東", "中部"];
  const group2 = ["近畿", "中国", "四国", "九州・沖縄"];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-12 px-4">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">

          {/* カラム1 */}
          <div className="lg:w-1/3 space-y-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Image
                src="/logo.png"
                alt="Payキャンロゴ"
                width={24}
                height={24}
                className="w-8 h-8"
              />
              <p className="text-2xl font-extrabold text-gray-800">
                <span className="text-accent">Pay</span>
                <span className="ml-1 text-base align-bottom">キャン</span>
                <span className="text-sm text-gray-500 ml-2">(ペイキャン)</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 leading-snug mt-1">
              PayPay・au PAY・楽天ペイ・d払い還元体験
            </p>

            <nav className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-accent transition">トップ</Link>
              <Link href="/campaigns" className="hover:text-accent transition">全国キャンペーン一覧</Link>
              <Link href="/management" className="hover:text-accent transition">運営管理</Link>
            </nav>

            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">よく検索されるキャンペーン:</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
                {popularSearches.map((item, index) => (
                  <Link
                    key={index}
                    href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
                    className="bg-gray-100 hover:bg-accent hover:text-white text-gray-700 text-sm px-3 py-1 rounded-full transition font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="flex justify-center lg:justify-start gap-4 mt-2">
                <Link
                  href="https://lin.ee/PwfONyl"
                  className="flex items-center gap-1 text-sm text-green-600 hover:underline"
                  target="_blank" rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={2} />
                  LINE公式
                </Link>
                <Link
                  href="https://x.com/paycancampaign"
                  className="flex items-center gap-1 text-sm text-black hover:underline"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Twitter className="w-4 h-4" strokeWidth={2} />
                  X公式
                </Link>
              </div>
            </div>
          </div>

          {/* カラム2 */}
          <div className="lg:w-1/3 text-sm text-left space-y-4 hidden lg:block">
            {group1.map(group => (
              <div key={group}>
                <p className="text-xs font-semibold text-gray-700 mb-1">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {prefectures
                    .filter(p => p.group === group)
                    .map(p =>
                      excludedSlugs.includes(p.slug) ? (
                        <span key={p.slug} className="text-gray-400">{p.name}</span>
                      ) : (
                        <Link
                          key={p.slug}
                          href={`/campaigns/${p.slug}`}
                          className="text-gray-700 hover:text-accent transition"
                        >
                          {p.name}
                        </Link>
                      )
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* カラム3 */}
          <div className="lg:w-1/3 text-sm text-left space-y-4 hidden lg:block">
            {group2.map(group => (
              <div key={group}>
                <p className="text-xs font-semibold text-gray-700 mb-1">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {prefectures
                    .filter(p => p.group === group)
                    .map(p =>
                      excludedSlugs.includes(p.slug) ? (
                        <span key={p.slug} className="text-gray-400">{p.name}</span>
                      ) : (
                        <Link
                          key={p.slug}
                          href={`/campaigns/${p.slug}`}
                          className="text-gray-700 hover:text-accent transition"
                        >
                          {p.name}
                        </Link>
                      )
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* モバイル都道府県 */}
          <div className="lg:hidden mt-6 text-center">
            <button
              onClick={() => setShowPrefectures(!showPrefectures)}
              className="text-sm font-semibold no-underline mb-2"
            >
              {showPrefectures ? "都道府県を閉じる" : "都道府県から探す"}
            </button>
            {showPrefectures && (
              <div className="space-y-3 mt-2">
                {[...group1, ...group2].map(group => (
                  <div key={group}>
                    <p className="text-xs font-semibold text-gray-700 mb-1">{group}</p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      {prefectures
                        .filter(p => p.group === group)
                        .map(p =>
                          excludedSlugs.includes(p.slug) ? (
                            <span key={p.slug} className="text-gray-400">{p.name}</span>
                          ) : (
                            <Link
                              key={p.slug}
                              href={`/campaigns/${p.slug}`}
                              className="text-gray-700 transition no-underline"
                            >
                              {p.name}
                            </Link>
                          )
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-10 text-center">
          &copy; {new Date().getFullYear()} Payキャン（ペイキャン）運営事務局
        </p>
      </Container>
    </footer>
  );
}
