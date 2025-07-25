'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { breadcrumbLabels } from "@/lib/breadcrumbLabels";
import { campaigns as pointCampaigns } from "@/lib/campaignMaster";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster"; // ✅ 追加
import Container from "@/components/layout/Container";

// ✅ ポイント系＋バウチャー系をマージ
const campaigns = [...pointCampaigns, ...voucherCampaignMaster];

export default function Breadcrumbs() {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const isSearchPage = path.startsWith("/campaigns/search");

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const prevSeg = segments[i - 1];

    const cityMatch = campaigns.find(
      (c) => c.prefectureSlug === prevSeg && c.citySlug === seg
    );

    const label =
      breadcrumbLabels[seg] ||         // 優先：固定ラベル
      cityMatch?.city ||               // 次点：市区町村名（前のセグメントが都道府県slugで一致）
      campaigns.find(
        (c) => c.prefectureSlug === seg
      )?.prefecture ||                 // それでもなければ都道府県名
      decodeURIComponent(seg);        // 最後の手段：slugそのまま

    return { href, label };
  });

  return (
    <nav className="relative z-40 mt-16 bg-[#f8f7f2] backdrop-blur-md">
      <Container>
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-gray-700 py-3">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              トップ
            </Link>
            <span className="mx-1 text-gray-400">/</span>
          </li>

          {isSearchPage ? (
            <>
              <li>
                <Link href="/campaigns" className="text-blue-600 hover:underline">
                  キャンペーン一覧
                </Link>
                <span className="mx-1 text-gray-400">/</span>
              </li>
              <li className="text-gray-800 font-medium">
                検索結果
              </li>
            </>
          ) : (
            crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={c.href} className="flex items-center">
                  {isLast ? (
                    <span className="text-gray-800 font-medium">{c.label}</span>
                  ) : (
                    <>
                      <Link href={c.href} className="text-blue-600 hover:underline">
                        {c.label}
                      </Link>
                      <span className="mx-1 text-gray-400">/</span>
                    </>
                  )}
                </li>
              );
            })
          )}
        </ol>
      </Container>
    </nav>
  );
}
