// ✅ /app/campaigns/[prefecture]/[city]/[pay]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { loadShopList } from "@/lib/loadShopList";
import { loadGenres } from "@/lib/loadGenres";
import { getCityMetadata } from "@/lib/metadataGenerators";

import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import ShopListGroup from "@/components/sections/city/ShopListGroupSortByGenrePriority";
import StoreRegistrationCTA from "@/components/common/StoreRegistrationCTA";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";

export async function generateMetadata({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}): Promise<Metadata> {
  return getCityMetadata(params.prefecture, params.city);
}

export default function CityPaytypePage({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}) {
  const paytypeId = params.pay as PayTypeId;
  if (!paytypeId) return notFound();

  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === params.prefecture &&
      c.citySlug === params.city &&
      c.paytype === paytypeId
  );
  if (!campaign) return notFound();

  const payLabel = PayTypeLabels[paytypeId];
  const isPayPay = paytypeId === "paypay";

  const shopList = isPayPay
    ? loadShopList(params.prefecture, params.city)
    : null;
  const genres = isPayPay
    ? loadGenres(params.prefecture, params.city)
    : [];

  const {
    prefecture,
    city,
    startDate,
    endDate,
    offer,
    fullpoint,
    campaigntitle,
    prefectureSlug,
    citySlug,
  } = campaign;

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeId}`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city,
    payLabel,
    offer,
    style: "impact",
  });

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="headline1">
          {city}の{payLabel}{offer}%還元キャンペーン
        </h1>

        <CampaignSummaryCard campaign={campaign} />
        <GenreHeaderNav genres={genres} paytypeLabel={payLabel} />
        <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />

        <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
          <p>
            <span className="font-semibold">{prefecture}{city}</span>で
            <span className="text-brand-primary font-bold">
              {formatJapaneseDate(startDate)}～{formatJapaneseDate(endDate)}
            </span>
            まで、{offer}％還元キャッシュレス応援キャンペーンが開催中。最大
            {formatNumber(fullpoint)}円分のポイントを獲得できます。
          </p>

          <h2 className="headline2">
            {city}の{payLabel}還元キャンペーンとは？
          </h2>
          <p>
            <strong>{prefecture}{city}「{campaigntitle}」</strong> は、
            対象店舗で{payLabel}を利用すると
            <span className="text-brand-primary font-bold">{offer}％</span>が
            戻ってくるお得なキャンペーンです。
          </p>
        </section>

        <div className="mt-10">
          <CampaignOverviewTable campaign={campaign} />
        </div>

        <div className="mt-10">
          <CampaignNotice campaign={campaign} />
        </div>

        <h2 className="headline2">
          {city}の{offer}%還元キャンペーン対象店舗
        </h2>

        {!shopList ? (
          <p className="mt-10 text-gray-700 text-base">
            現時点では対象店舗情報が公表されていません。<br />
            公表されましたらこのページで紹介いたします。
          </p>
        ) : (
          <>
            <ShopListGroup shopList={shopList} />
            <StoreRegistrationCTA />
          </>
        )}

        <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />


        <div className="mt-20">
          <RecommendedCampaigns
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
          />
        </div>

        
        <BackNavigationButtons
          prefecture={prefecture}
          prefectureSlug={prefectureSlug}
        />
      </main>
    </div>
  );
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}
