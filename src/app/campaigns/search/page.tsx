// /app/search/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { campaigns } from '@/lib/campaignMaster';
import CampaignCard from '@/components/common/CampaignCard';
import BackNavigationButtons from '@/components/common/BackNavigationButtons';
import Link from 'next/link';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LayoutShell from '@/components/layout/LayoutShell';
import { isCampaignActive } from '@/lib/campaignUtils';


function SearchResultsInner() {
  const searchParams = useSearchParams();
  const keyword = decodeURIComponent(searchParams.get('q') || '')
    .toLowerCase()
    .trim();

  const filtered = campaigns.filter(
    (c) =>
      `${c.prefecture}${c.city}`.toLowerCase().includes(keyword) &&
      isCampaignActive(c.endDate)
  );

  return (
    <>
      <h1 className="headline1">
        「{keyword}」の検索結果{' '}
        <span className="text-base text-gray-500">（{filtered.length}件）</span>
      </h1>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground mb-12 text-base">
          該当するキャンペーンは見つかりませんでした。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((c) => (
            <Link
              key={`${c.prefectureSlug}-${c.citySlug}-${c.paytype}`}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`}
              className="block transition-transform hover:scale-[1.02]">
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                startDate={c.startDate}
                endDate={c.endDate}
                fullpoint={c.fullpoint}
                paytype={c.paytype}
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <Header />
        <Suspense fallback={<div>検索中...</div>}>
          <SearchResultsInner />
        </Suspense>
        <BackNavigationButtons />
      </div>
    </div>
  );
}
