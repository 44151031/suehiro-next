// ✅ 最終完全版（FAQ構造化データ含む統合構造化データ対応済み）
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
import OtherPaytypesCampaigns from "@/components/sections/city/OtherPaytypesCampaigns";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import StoreRegistrationCTA from "@/components/common/StoreRegistrationCTA";
import CTAShopList from "@/components/sections/city/CTAShopList";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import SampleShopExample from "@/components/sections/shop/SampleShopExample";
import CampaignStatusNotice from "@/components/common/CampaignStatusNotice";
import { getPaytypeMetadata } from "@/lib/metadataGenerators";
import PaytypeCampaignStructuredData from "@/components/structured/PaytypeCampaignStructuredData"; // ✅ 統合構造化データ
import CityCampaignFAQ from "@/components/sections/city/CampaignFAQ";

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
  if (!paytypeId || !(paytypeId in PayTypeLabels)) return notFound();

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
  const genres = await loadGenres(params.prefecture, params.city, paytypeId);

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

  return (
    <>
      {/* ✅ 統合構造化データ出力（FAQ含む） */}
      <PaytypeCampaignStructuredData
        prefecture={prefecture}
        prefectureSlug={prefectureSlug}
        city={city}
        citySlug={citySlug}
        paytype={paytypeId} // ✅ スラッグ形式（小文字）で渡す
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

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {city}の{payLabel}
            {offer}%還元キャンペーン対象店舗一覧
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-800">
              最終更新日：{formatJapaneseDate(modified)}｜ 公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}
          <p className="text-xs md:text-base leading-relaxed text-gray-800">
            <span className="font-semibold">{prefecture}{city}</span>で
            <span className="text-brand-primary font-bold">
              {formatJapaneseDate(startDate)}から
              {formatJapaneseDate(endDate)}
            </span>
            までの期間で、
            <span className="font-semibold">{payLabel}{offer}％還元</span>
            キャンペーンが開催。このページでは効率よくポイントを獲得できるように対象店舗をジャンルに分けて紹介しています。
          </p>

          <CTAShopList
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
            paytype={paytypeId}
          />
          <CampaignStatusNotice campaign={campaign} />
          <CampaignSummaryCard campaign={campaign} />
          <GenreHeaderNav genres={genres} paytypeLabel={payLabel} paytype={paytypeId} />
          <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />

          <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">


            <h2 className="headline2">
              キャンペーン概要|{city}の{payLabel}還元キャンペーンとは？
            </h2>
            <p>
              <strong>{prefecture}{city}「{campaigntitle}」</strong> は、
              <span className="text-brand-primary font-bold">
                {formatJapaneseDate(startDate)}から
                {formatJapaneseDate(endDate)}
              </span>
              までの期間で、{city}の対象店舗で{payLabel}でお支払いすると、
              <span className="text-brand-primary font-bold">{offer}％</span>
              が還元されるお得なキャンペーンです。最大{formatNumber(fullpoint)}円分のポイントを獲得できます。
            </p>
          </section>

          <div className="mt-10">
            <CampaignOverviewTable campaign={campaign} />
          </div>

          <div className="mt-10">
            <CampaignNotice campaign={campaign} />
          </div>

          <h2
            id="shop-list-section"
            className="headline2 mb-4 scroll-mt-34"
          >
            {payLabel}が使える{city}の{offer}%還元対象店舗一覧
          </h2>

          {!shopListByGenre ? (
            <>
              <p className="mt-10 text-gray-700 text-base">
                現時点では対象店舗情報が公表されていません。
                <br />
                公表されましたらこのページで紹介いたします。
              </p>
            </>
          ) : (
            <>
              <GenreShopLists
                shopListByGenre={shopListByGenre}
                detailsJsonPath={detailsJsonPath}
              />
            </>
          )}

          <OtherPaytypesCampaigns
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
            currentPaytype={paytypeId}
          />

          <SampleShopExample />
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
              city={city}
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
