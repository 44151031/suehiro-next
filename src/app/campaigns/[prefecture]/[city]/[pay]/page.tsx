// ✅ 最終完全版
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { loadShopList } from "@/lib/loadShopList";
import { loadGenres } from "@/lib/loadGenres";
import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import StoreRegistrationCTA from "@/components/common/StoreRegistrationCTA";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import SampleShopExample from "@/components/sections/shop/SampleShopExample";
import CampaignStatusNotice from "@/components/common/CampaignStatusNotice";
import { getPaytypeMetadata } from "@/lib/metadataGenerators";
import CampaignStructuredData from "@/components/structured/CampaignStructuredData";
import CityCampaignFAQ from "@/components/sections/city/CampaignFAQ";
import { generateCityFAQStructuredData } from "@/lib/FAQTemplateGenerator"; // ✅ 追加

type Props = {
  params: { prefecture: string; city: string; pay: string };
};

export function generateMetadata({ params }: Props) {
  return getPaytypeMetadata(params.prefecture, params.city, params.pay);
}

export default async function CityPaytypePage({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}) {
  const paytypeId = params.pay as PayTypeId;
  if (!paytypeId) return notFound();

  const campaign = campaigns
    .filter(
      (c) =>
        c.prefectureSlug === params.prefecture &&
        c.citySlug === params.city &&
        c.paytype === paytypeId
    )
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

  if (!campaign) return notFound();

  const payLabel = PayTypeLabels[paytypeId];

  const shopListByGenre = await loadShopList(params.prefecture, params.city, paytypeId);
  const genres = await loadGenres(params.prefecture, params.city, paytypeId); // ✅ 修正済み

  const {
    prefecture,
    city,
    startDate,
    endDate,
    offer,
    fullpoint,
    onepoint,
    campaigntitle,
    prefectureSlug,
    citySlug,
    datePublished,
    dateModified,
    lastUpdated,
  } = campaign as Record<string, any>;

  const modified = dateModified ?? lastUpdated ?? datePublished;

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeId}`;
  const detailsJsonPath = `/data/shopsdetails/${prefectureSlug}-${citySlug}-shops-details.json`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city,
    payLabel,
    offer,
    style: "impact",
  });

  const faqStructuredData = generateCityFAQStructuredData(prefecture, city, payLabel); // ✅ FAQ構造化データ生成

  return (
    <>
      {/* ✅ キャンペーン構造化データ */}
      <CampaignStructuredData
        prefecture={prefecture}
        prefectureSlug={prefectureSlug}
        city={city}
        citySlug={citySlug}
        paytype={payLabel}
        headline={`${city} × ${payLabel} 最大${offer}％還元キャンペーン【${formatJapaneseDate(endDate)}まで】`}
        articleDescription={`本記事では、${prefecture}${city}で開催される${payLabel}ポイント還元キャンペーンの概要、対象条件、注意事項、対象店舗一覧などを解説します。`}
        offerDescription={`${formatJapaneseDate(startDate)}から${formatJapaneseDate(endDate)}まで、${prefecture}${city}内の対象店舗で${payLabel}決済を行うと、最大${offer}％のポイントが還元されるキャンペーンが実施されます。`}
        validFrom={startDate}
        validThrough={endDate}
        url={pageUrl}
        offerRate={Number(offer)}
        onePayLimit={String(onepoint)}
        fullPayLimit={String(fullpoint)}
        datePublished={datePublished}
        dateModified={modified}
        officialUrl={campaign.officialUrl}
      />

      {/* ✅ FAQ構造化データの埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {city}の{payLabel}
            {offer}%還元キャンペーン
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-800">
              最終更新日：{formatJapaneseDate(modified)}｜ 公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}

          <CampaignStatusNotice campaign={campaign} />
          <CampaignSummaryCard campaign={campaign} />
          <GenreHeaderNav genres={genres} paytypeLabel={payLabel} paytype={paytypeId} />
          <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />

          <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
            <p>
              <span className="font-semibold">{prefecture}{city}</span>で
              <span className="text-brand-primary font-bold">
                {formatJapaneseDate(startDate)}～
                {formatJapaneseDate(endDate)}
              </span>
              まで、{offer}％還元キャッシュレス応援キャンペーンが開催。最大
              {formatNumber(fullpoint)}円分のポイントを獲得できます。
            </p>

            <h2 className="headline2">
              {city}の{payLabel}還元キャンペーンとは？
            </h2>
            <p>
              <strong>{prefecture}{city}「{campaigntitle}」</strong> は、
              対象店舗で{payLabel}を利用すると
              <span className="text-brand-primary font-bold">{offer}％</span>
              が戻ってくるお得なキャンペーンです。
            </p>
          </section>

          <div className="mt-10">
            <CampaignOverviewTable campaign={campaign} />
          </div>

          <div className="mt-10">
            <CampaignNotice campaign={campaign} />
          </div>

          <h2 className="headline2 mb-4">
            {city}の{offer}%還元キャンペーン対象店舗
          </h2>

          {!shopListByGenre ? (
            <>
              <p className="mt-10 text-gray-700 text-base">
                現時点では対象店舗情報が公表されていません。
                <br />
                公表されましたらこのページで紹介いたします。
              </p>
              <SampleShopExample />
            </>
          ) : (
            <>
              <GenreShopLists
                shopListByGenre={shopListByGenre}
                detailsJsonPath={detailsJsonPath}
              />
              <SampleShopExample />
            </>
          )}

          <StoreRegistrationCTA />
          <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />
          <CityCampaignFAQ
            prefecture={prefecture}
            city={city}
            payLabel={payLabel}
          />
          <div className="mt-20">
            <RecommendedCampaigns
              prefectureSlug={prefectureSlug}
              citySlug={citySlug}
              currentPaytype={paytypeId}
            />
          </div>
          <BackNavigationButtons
            prefecture={prefecture}
            prefectureSlug={prefectureSlug}
          />
        </main>
      </div>
    </>
  );
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}
