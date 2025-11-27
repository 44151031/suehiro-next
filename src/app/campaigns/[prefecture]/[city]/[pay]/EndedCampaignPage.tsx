// /app/campaigns/[prefecture]/[city]/[pay]/EndedCampaignPage.tsx
// 🏁 終了キャンペーン専用テンプレート（SEO最適化済み・インデックス維持対応）

import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import PaytypeCampaignStructuredData from "@/components/structured/PaytypeCampaignStructuredData";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CityCampaignFAQ from "@/components/sections/city/CampaignFAQ";
import StoreRegistrationCTA from "@/components/common/StoreRegistrationCTA";
import AdUnit from "@/components/common/AdUnit";

//
// 🔹 終了月に基づく開催傾向メッセージを自動生成
//
function generateCampaignTrend(city: string, payLabel: string, endDate: string): string {
  const month = new Date(endDate).getMonth() + 1;

  if ([1, 2].includes(month)) {
    return `${city}では、冬季（1〜2月）に${payLabel}キャンペーンが実施されることが多く、年末年始の買い物支援策として企画される傾向があります。`;
  } else if ([3, 4, 5].includes(month)) {
    return `${city}では、春（3〜5月）の新生活応援キャンペーンとして${payLabel}が開催されるケースが見られます。`;
  } else if ([6, 7].includes(month)) {
    return `${city}では、初夏（6〜7月）に地域の商店街活性化を目的とした${payLabel}キャンペーンが行われる傾向があります。`;
  } else if ([8, 9].includes(month)) {
    return `${city}では、夏〜初秋（8〜9月）に${payLabel}キャンペーンが実施される例があり、観光シーズンやイベントと連動するケースもあります。`;
  } else {
    return `${city}では、秋〜冬（10〜12月）にかけて${payLabel}キャンペーンが行われることが多く、年末商戦に合わせて実施される傾向があります。`;
  }
}

export default async function EndedCampaignPage({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}) {
  const paytypeId = params.pay as PayTypeId;
  if (!paytypeId || !(paytypeId in PayTypeLabels)) return notFound();

  const campaign = campaigns
    .filter(
      (c) =>
        c.prefectureSlug === params.prefecture &&
        c.citySlug === params.city &&
        c.paytype === paytypeId
    )
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];

  if (!campaign) return notFound();

  const payLabel = PayTypeLabels[paytypeId];
  const {
    prefecture,
    city,
    startDate,
    endDate,
    offer,
    fullpoint,
    onepoint,
    prefectureSlug,
    citySlug,
    datePublished,
    dateModified,
  } = campaign as Record<string, any>;

  const modified = dateModified ?? datePublished;
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeId}`;
  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city,
    payLabel,
    offer,
    style: "archive",
  });

  // ✅ 自動生成された傾向文
  const trendText = generateCampaignTrend(city, payLabel, endDate);

  return (
    <>
      {/* ✅ 終了済みでも意味のある構造化データを維持 */}
      <PaytypeCampaignStructuredData
        prefecture={prefecture}
        prefectureSlug={prefectureSlug}
        city={city}
        citySlug={citySlug}
        paytype={paytypeId}
        headline={`${city} × ${payLabel} 過去のキャンペーン情報（最大${offer}%還元）`}
        articleDescription={`${prefecture}${city}で実施された${payLabel}キャンペーンの概要や結果、還元率、実施期間をまとめています。`}
        offerDescription={`${formatJapaneseDate(startDate)}から${formatJapaneseDate(
          endDate
        )}まで、${prefecture}${city}で開催された${payLabel}の${offer}％還元キャンペーンの記録です。`}
        validFrom={startDate}
        validThrough={endDate}
        offerRate={Number(offer)}
        onePayLimit={String(onepoint)}
        fullPayLimit={String(fullpoint)}
        eventStatus="https://schema.org/EventCancelled"
        datePublished={datePublished}
        dateModified={modified}
        url={pageUrl}
      />

      {/* ✅ StandardCampaignPage と統一した背景・構造 */}
      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {city}で実施された{payLabel}キャンペーンの開催実績（最大{offer}%還元）
          </h1>

          <p className="m-1 text-sm text-right text-gray-700">
            最終更新日：{formatJapaneseDate(modified)}｜公開：
            {formatJapaneseDate(datePublished)}
          </p>

          <section className="mt-6 text-gray-800 leading-relaxed space-y-4">
            <p>
              本ページでは、<strong>{prefecture}{city}</strong>で開催された
              <strong>{payLabel}</strong>のポイント還元キャンペーンの詳細をアーカイブとして掲載しています。
              終了済みですが、<strong>次回開催の傾向</strong>や<strong>他の自治体の動向</strong>を把握する上で参考になります。
            </p>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
              <p className="font-semibold text-gray-900">
                開催期間：{formatJapaneseDate(startDate)} 〜 {formatJapaneseDate(endDate)}
              </p>
              <p>
                最大還元率：{offer}％ ／ 付与上限：1回あたり{onepoint}円・期間あたり{fullpoint}円
              </p>
            </div>
          </section>

          <AdUnit />

          <section className="mt-8">
            <h2 className="headline2 mb-3">現在開催中のキャンペーンをチェック</h2>
            <p className="text-sm text-gray-700 mb-2">
              現在開催中の{prefecture}内キャンペーンはこちら：
            </p>
            <a
              href={`/campaigns/${prefectureSlug}`}
              className="text-brand-primary font-semibold underline"
            >
              ▶ {prefecture}の開催中キャンペーン一覧を見る
            </a>
          </section>

          <section className="mt-10">
            <h2 className="headline2 mb-3">次回開催の見通し・過去実績からわかる傾向</h2>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              {trendText}
              最新情報が発表され次第、このページでもお知らせします。
            </p>
          </section>
          <div className="mt-12">
            <RecommendedCampaigns
              prefectureSlug={prefectureSlug}
              citySlug={citySlug}
              currentPaytype={paytypeId}
              city={city}
            />
          </div>
          <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />

          <div className="mt-12">
            <CityCampaignFAQ prefecture={prefecture} city={city} payLabel={payLabel} />
          </div>

          <StoreRegistrationCTA />
          <BackNavigationButtons prefecture={prefecture} prefectureSlug={prefectureSlug} />
        </main>
      </div>
    </>
  );
}
