import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import Link from "next/link";
import { formatJapaneseDate, isNowInCampaignPeriod } from "@/lib/campaignUtils";
import { CampaignListByPrefecture } from "@/components/common/CampaignListByPrefecture";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import { getPrefectureMetadata } from "@/lib/metadataGenerators";

export async function generateMetadata({
  params,
}: {
  params: { prefecture: string };
}): Promise<Metadata> {
  return getPrefectureMetadata(params.prefecture);
}

export default function PrefecturePage({
  params,
}: {
  params: { prefecture: string };
}) {
  const list = campaigns.filter((c) => c.prefectureSlug === params.prefecture);
  if (list.length === 0) return notFound();

  const prefectureName = list[0].prefecture;
  const active = list.filter((c) => isNowInCampaignPeriod(c.startDate, c.endDate));
  const upcoming = list.length - active.length;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">

        {/* ✅ タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6">
          {prefectureName}のキャッシュレスキャンペーン一覧
        </h1>

        {/* ✅ 合計ポイント */}
        <CampaignTotalPointSummary campaigns={list} areaLabel={prefectureName} />

        {/* ✅ 概要文 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-base sm:text-lg text-neutral-700 leading-snug">
            <span className="text-[17px] sm:text-xl font-semibold">
              {prefectureName}では、現在{" "}
              <span className="text-orange-600 font-bold">{active.length}件</span> のキャンペーンが開催中です。
            </span>
            <span className="ml-1 text-[17px] sm:text-xl font-semibold">
              <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
            </span>
          </p>
        </div>

        {/* ✅ 一覧 */}
        <CampaignListByPrefecture prefectureSlug={params.prefecture} />

        {/* ✅ 戻る */}
        <BackNavigationButtons prefectureSlug={params.prefecture} prefecture={prefectureName} />
      </div>
    </div>
  );
}
