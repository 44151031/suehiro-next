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
import CityCampaignStructuredData from "@/components/structured/CityCampaignStructuredData";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import Link from "next/link";
import CampaignLineCard from "@/components/common/CampaignLineCard";

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

  const filteredList = list.filter((c) => isCampaignActive(c.endDate));
  const active = filteredList.filter((c) =>
    isNowInCampaignPeriod(c.startDate, c.endDate)
  );
  const upcoming = filteredList.length - active.length;

  const headline = `${cityName}のキャッシュレスキャンペーン情報`;
  const articleDescription = `Payキャンでは${prefectureName}${cityName}で現在・今後開催予定のキャッシュレス決済キャンペーン情報を掲載中。PayPay、楽天ペイ、d払い、auPAYなどの対象キャンペーンを網羅しています。`;
  const url = `https://paycancampaign.com/campaigns/${prefecture}/${city}`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city: cityName,
    style: "city",
  });

  return (
    <>
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
              active.length === 0 && upcoming > 0 ? (
                <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                  <span className="text-[17px] sm:text-xl font-semibold">
                    {prefectureName}{cityName}では現在
                    <span className="text-green-700 font-bold"> {upcoming}件</span>
                    が開催予定となっています。開催日に向けてお買い物を調整しましょう。
                  </span>
                </p>
              ) : (
                <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                  <span className="text-[17px] sm:text-xl font-semibold">
                    {prefectureName}{cityName}では、現在{" "}
                    <span className="text-orange-600 font-bold">{active.length}件</span> のキャンペーンが開催中です。
                  </span>
                  <span className="ml-1 text-[17px] sm:text-xl font-semibold">
                    <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
                  </span>
                </p>
              )
            ) : (
              <p className="text-base sm:text-lg text-neutral-700 leading-snug font-semibold">
                現在、{prefectureName}{cityName}で実施中または予定されているキャンペーンはありません。
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

          {/* SNSシェアボタン */}
          <SNSShareButtons url={url} title={shareTitle} hashtags={shareHashtags} />

          {/* 同じ都道府県の他キャンペーン表示 */}
          {(() => {
            const otherPrefectureCampaigns = campaigns
              .filter(
                (c) =>
                  c.prefectureSlug === prefecture &&
                  c.citySlug !== city &&
                  isCampaignActive(c.endDate)
              )
              .sort((a, b) => {
                const aActive = isNowInCampaignPeriod(a.startDate, a.endDate);
                const bActive = isNowInCampaignPeriod(b.startDate, b.endDate);
                return Number(bActive) - Number(aActive);
              });

            if (otherPrefectureCampaigns.length === 0) return null;

            return (
              <section className="mt-16">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                  {prefectureName}内の他のキャンペーンもチェック！
                </h2>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {otherPrefectureCampaigns.slice(0, 6).map((c) => {
                    const paySlug = c.paytype;
                    if (!paySlug) return null;

                    return (
                      <li key={`${c.prefectureSlug}-${c.citySlug}-${paySlug}`}>
                        <Link
                          href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${paySlug}`}
                          className="block"
                        >
                          <CampaignLineCard
                            prefecture={c.prefecture}
                            city={c.city}
                            startDate={c.startDate}
                            endDate={c.endDate}
                            offer={c.offer}
                            fullpoint={c.fullpoint}
                            onepoint={c.onepoint}
                            paytype={c.paytype}
                            isActive={isNowInCampaignPeriod(c.startDate, c.endDate)}
                            showPrefecture={false}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })()}

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
