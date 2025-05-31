import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaignMaster";
import { loadShopList } from "@/lib/loadShopList";
import { loadGenres } from "@/lib/loadGenres";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { PayTypeLabels, SlugToPayTypeId } from "@/lib/payType";

import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import ShopListGroup from "@/components/sections/city/ShopListGroupSortByGenrePriority";

export default function CityPaytypePage({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}) {
  const paytypeId = SlugToPayTypeId[params.pay];
  if (!paytypeId) return notFound();

  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === params.prefecture &&
      c.citySlug === params.city &&
      c.paytype === paytypeId
  );
  if (!campaign) return notFound();

  const shopList = loadShopList(params.prefecture, params.city);
  const genres = loadGenres(params.prefecture, params.city);

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

  const payLabel = PayTypeLabels[paytypeId];

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6">
          {city}の{payLabel}{offer}%還元キャンペーン
        </h1>

        {/* 概要カード（計算処理は内部で実施） */}
        <CampaignSummaryCard campaign={campaign} />

        {/* ジャンルリンク */}
        <GenreHeaderNav genres={genres} />

        {/* 説明 */}
        <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
          <p>
            <span className="font-semibold">{prefecture}{city}</span>で
            <span className="text-brand-primary font-bold">
              {formatJapaneseDate(startDate)}～{formatJapaneseDate(endDate)}
            </span>
            まで、{offer}％還元キャッシュレス応援キャンペーンが開催中。最大
            {formatNumber(fullpoint)}円分のポイントを獲得できます。
          </p>

          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-1 mt-12">
            {city}の{payLabel}還元キャンペーンとは？
          </h2>
          <p>
            <strong>{prefecture}{city}「{campaigntitle}」</strong> は、
            対象店舗で{payLabel}を利用すると
            <span className="text-brand-primary font-bold">{offer}％</span>が
            戻ってくるお得なキャンペーンです。
          </p>
        </section>

        {/* 概要テーブル */}
        <div className="mt-10">
          <CampaignOverviewTable campaign={campaign} />
        </div>

        {/* 注意事項 */}
        <div className="mt-10">
          <CampaignNotice campaign={campaign} />
        </div>

        {/* 対象店舗 */}
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-1 mt-12">
          {city}の{offer}%還元キャンペーン対象店舗
        </h2>

        {!shopList ? (
          <p className="mt-10 text-gray-700 text-base">
            現時点では対象店舗情報が公表されていません。<br />
            公表されましたらこのページで紹介いたします。
          </p>
        ) : (
          <ShopListGroup shopList={shopList} />
        )}

        {/* 他キャンペーン */}
        <div className="mt-20">
          <RecommendedCampaigns
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
          />
        </div>

        {/* 戻るボタン */}
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
