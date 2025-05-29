'use client';

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { breadcrumbLabels } from "@/lib/breadcrumbLabels";
import { campaigns } from "@/lib/campaigns";
import Container from "@/components/layout/Container";

export default function Breadcrumbs() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const isSearchPage = path.startsWith("/campaigns/search");
  const queryKeyword = searchParams.get("q");

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const prevSeg = segments[i - 1];

    const cityMatch = campaigns.find(
      (c) => c.prefectureSlug === prevSeg && c.citySlug === seg
    );

    const label =
      breadcrumbLabels[seg] ||
      campaigns.find((c) => c.prefectureSlug === seg)?.prefecture ||
      cityMatch?.city ||
      decodeURIComponent(seg);

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

          {isSearchPage && queryKeyword ? (
            <>
              <li>
                <Link href="/campaigns" className="text-blue-600 hover:underline">
                  キャンペーン一覧
                </Link>
                <span className="mx-1 text-gray-400">/</span>
              </li>
              <li className="text-gray-800 font-medium">
                「{decodeURIComponent(queryKeyword)}」の検索結果
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
