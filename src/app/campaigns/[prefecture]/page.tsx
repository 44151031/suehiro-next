import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import {
  formatJapaneseDate,
  isNowInCampaignPeriod,
  isCampaignActive,
} from "@/lib/campaignUtils";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import { CampaignCardList } from "@/components/common/CampaignCardList";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import { getPrefectureMetadata } from "@/lib/metadataGenerators";

type Props = {
  params: { prefecture: string };
};

export function generateMetadata({ params }: Props) {
  return getPrefectureMetadata(params.prefecture);
}

export default function PrefecturePage({
  params,
}: {
  params: { prefecture: string };
}) {
  const { prefecture } = params;

  // ✅ 全キャンペーン抽出（ページ存在判定用）
  const list = campaigns.filter((c) => c.prefectureSlug === prefecture);
  if (list.length === 0) return notFound();

  const prefectureName = list[0].prefecture;

  // ✅ 終了していないキャンペーンだけ抽出
  const activeList = list.filter((c) => isCampaignActive(c.endDate));
  const active = activeList.filter((c) =>
    isNowInCampaignPeriod(c.startDate, c.endDate)
  );
  const upcoming = activeList.length - active.length;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="headline1">
          {prefectureName}のキャッシュレスキャンペーン一覧
        </h1>

        {/* 合計ポイント（終了済みは含めない） */}
        <CampaignTotalPointSummary campaigns={activeList} areaLabel={prefectureName} />

        {/* 概要文 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {activeList.length > 0 ? (
            <p className="text-base sm:text-lg text-neutral-700 leading-snug">
              <span className="text-[17px] sm:text-xl font-semibold">
                {prefectureName}では、現在開催中のキャンペーンは{" "}
                <span className="text-orange-600 font-bold">{active.length}件</span>です。
              </span>
              <span className="ml-1 text-[17px] sm:text-xl font-semibold">
                <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
              </span>
            </p>
          ) : (
            <p className="text-base sm:text-lg text-neutral-700 leading-snug font-semibold">
              現在、{prefectureName}で開催中または予定されているキャンペーンはありません。
            </p>
          )}
        </div>

        {/* カード一覧（表示されるキャンペーンがある場合のみ） */}
        {activeList.length > 0 && (
          <div className="prefecture-page-card-container">
            <CampaignCardList campaigns={activeList} />
          </div>
        )}

        {/* 終了済みしかないときにレコメンド表示（citySlug は空文字で渡す） */}
        {activeList.length === 0 && (
          <RecommendedCampaigns
            prefectureSlug={prefecture}
            citySlug={""}
            currentPaytype=""
          />
        )}

        {/* 戻るボタン */}
        <BackNavigationButtons
          prefecture={prefectureName}
          prefectureSlug={prefecture}
        />
      </div>
    </div>
  );
}
