'use client';

import { useSearchParams } from 'next/navigation';
import { campaigns } from '@/lib/campaigns';
import CampaignCard from '@/components/common/CampaignCard';
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import Link from 'next/link';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const keyword = decodeURIComponent(searchParams.get('q') || '').toLowerCase().trim();

  const filtered = campaigns.filter((c) =>
    `${c.prefecture}${c.city}`.toLowerCase().includes(keyword)
  );

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6 border-l-4 border-neutral-800 pl-4">
          「{keyword}」の検索結果（{filtered.length}件）
        </h1>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground mb-12">
            該当するキャンペーンは見つかりませんでした。
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {filtered.map((c) => (
              <Link
                key={`${c.prefectureSlug}-${c.citySlug}`}
                href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
                className="block transition-transform hover:scale-[1.02]"
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

        <BackNavigationButtons />
      </div>
    </div>
  );
}
