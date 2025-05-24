// ✅ /app/campaigns/[prefecture]/page.tsx

import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import CampaignCard from "@/components/common/CampaignCard";

export default function PrefecturePage({
  params,
}: {
  params: { prefecture: string };
}) {
  const list = campaigns.filter(
    (c) => c.prefectureSlug === params.prefecture
  );

  if (list.length === 0) return notFound();

  const prefectureName = list[0].prefecture;

  return (
    <div className="bg-white w-full">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* タイトル */}
        <h1 className="text-3xl font-bold text-primary mb-8">
          {prefectureName}のPayPayキャンペーン一覧
        </h1>

        {/* キャンペーンカード */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link
              key={`${c.prefectureSlug}-${c.citySlug}`}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
              className="block"
            >
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                fullpoint={c.fullpoint}
                startDate={c.startDate}
                endDate={c.endDate}
                period={`${formatJapaneseDate(c.startDate, "から", { omitYear: true })}〜${formatJapaneseDate(c.endDate, "まで", { omitYear: true })}`}
              />
            </Link>
          ))}
        </div>

        {/* 戻るリンク */}
        <div className="mt-12 border-t pt-6 text-center">
          <Link href="/" className="text-blue-600 underline text-sm">
            トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
