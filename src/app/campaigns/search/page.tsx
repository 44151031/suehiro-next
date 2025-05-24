// app/campaigns/search-results/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { campaigns } from '@/lib/campaigns';
import CampaignCard from '@/components/common/CampaignCard';
import Link from 'next/link';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const keyword = decodeURIComponent(searchParams.get('q') || '').toLowerCase().trim();

  const filtered = campaigns.filter((c) =>
    `${c.prefecture}${c.city}`.toLowerCase().includes(keyword)
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-primary mb-6">
        「{keyword}」の検索結果（{filtered.length}件）
      </h1>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">該当するキャンペーンは見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Link
              key={`${c.prefectureSlug}-${c.citySlug}`}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
              className="block"
            >
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                startDate={c.startDate}
                endDate={c.endDate}
                fullpoint={c.fullpoint}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
