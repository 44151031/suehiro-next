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
import { getCityMetadata } from "@/lib/metadataGenerators";
import CityCampaignStructuredData from "@/components/structured/CityCampaignStructuredData"; // ✅ 追加

type Props = {
  params: { prefecture: string; city: string };
};

export function generateMetadata({ params }: Props) {
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

  // ✅ 終了していないキャンペーンだけ
  const filteredList = list.filter((c) => isCampaignActive(c.endDate));
  const active = filteredList.filter((c) =>
    isNowInCampaignPeriod(c.startDate, c.endDate)
  );
  const upcoming = filteredList.length - active.length;

  const headline = `${cityName}のキャッシュレスキャンペーン情報`;
  const articleDescription = `Payキャンでは${prefectureName}${cityName}で現在・今後開催予定のキャッシュレス決済キャンペーン情報を掲載中。PayPay、楽天ペイ、d払い、auPAYなどの対象キャンペーンを網羅しています。`;
  const url = `https://paycancampaign.com/campaigns/${prefecture}/${city}`;

  return (
    <>
      {/* ✅ 構造化データ挿入 */}
      <CityCampaignStructuredData
        prefecture={prefectureName}
        prefectureSlug={prefecture}
        city={cityName}
        citySlug={city}
        headline={headline}
        articleDescription={articleDescription}
        url={url}
      />

      <main className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          {/* タイトル */}
          <h1 className="headline1">
            {cityName}のキャッシュレスキャンペーン一覧
          </h1>

          {/* 合計ポイント */}
          <CampaignTotalPointSummary campaigns={filteredList} areaLabel={cityName} />

          {/* 概要 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {filteredList.length > 0 ? (
              <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                <span className="text-[17px] sm:text-xl font-semibold">
                  {cityName}では、現在{" "}
                  <span className="text-orange-600 font-bold">{active.length}件</span> のキャンペーンが開催中です。
                </span>
                <span className="ml-1 text-[17px] sm:text-xl font-semibold">
                  <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
                </span>
              </p>
            ) : (
              <p className="text-base sm:text-lg text-neutral-700 leading-snug font-semibold">
                現在、{cityName}で実施中または予定されているキャンペーンはありません。
              </p>
            )}
          </div>

          {/* カード一覧 */}
          {filteredList.length > 0 && (
            <div className="city-page-card-container">
              <CampaignCardList campaigns={filteredList} />
            </div>
          )}

          {/* 終了済みしかないときにレコメンド表示 */}
          {filteredList.length === 0 && (
            <RecommendedCampaigns prefectureSlug={prefecture} citySlug={city} />
          )}

          {/* 戻るボタン */}
          <BackNavigationButtons
            prefecture={prefectureName}
            prefectureSlug={prefecture}
          />
        </div>
      </main>
    </>
  );
}
