import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { campaigns } from "@/lib/campaignMaster";
import { formatJapaneseDate, isNowInCampaignPeriod } from "@/lib/campaignUtils";
import { PayTypeSlugMap } from "@/lib/payType";
import CampaignCard from "@/components/common/CampaignCard";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import { getCityMetadata } from "@/lib/metadataGenerators";

// ✅ メタデータ（市区町村ページ）
export async function generateMetadata({
  params,
}: {
  params: { prefecture: string; city: string };
}): Promise<Metadata> {
  return getCityMetadata(params.prefecture, params.city);
}

export default function CityCampaignsPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const { prefecture, city } = params;

  const list = campaigns.filter(
    (c) => c.prefectureSlug === prefecture && c.citySlug === city
  );

  if (list.length === 0) return notFound();

  const cityName = list[0].city;
  const prefectureName = list[0].prefecture;

  const active = list.filter((c) => isNowInCampaignPeriod(c.startDate, c.endDate));
  const upcoming = list.length - active.length;

  return (
    <main className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6">
          {cityName}のキャッシュレスキャンペーン一覧
        </h1>

        {/* 概要 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-base sm:text-lg text-neutral-700 leading-snug">
            <span className="text-[17px] sm:text-xl font-semibold">
              {cityName}では、現在{" "}
              <span className="text-orange-600 font-bold">{active.length}件</span> のキャンペーンが開催中です。
            </span>
            <span className="ml-1 text-[17px] sm:text-xl font-semibold">
              <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
            </span>
          </p>
        </div>

        {/* 合計ポイント */}
        <CampaignTotalPointSummary campaigns={list} areaLabel={cityName} />

        {/* キャンペーンカード一覧 */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const paySlug = PayTypeSlugMap[c.paytype];
            if (!paySlug) return null; // 念のため無効スキップ

            return (
              <Link
                key={`${c.prefectureSlug}-${c.citySlug}-${c.paytype}`}
                href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${paySlug}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <CampaignCard
                  prefecture={c.prefecture}
                  city={c.city}
                  offer={c.offer}
                  fullpoint={c.fullpoint}
                  startDate={c.startDate}
                  endDate={c.endDate}
                  period={
                    c.startDate && c.endDate
                      ? `${formatJapaneseDate(c.startDate, undefined, {
                          omitYear: true,
                        })}〜${formatJapaneseDate(c.endDate, undefined, {
                          omitYear: true,
                        })}`
                      : ""
                  }
                  paytype={c.paytype}
                />
              </Link>
            );
          })}
        </div>

        {/* 戻る */}
        <BackNavigationButtons
          prefecture={prefectureName}
          prefectureSlug={prefecture}
        />
      </div>
    </main>
  );
}
