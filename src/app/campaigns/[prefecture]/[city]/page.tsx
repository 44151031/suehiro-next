// app/campaigns/[prefecture]/[city]/page.tsx
import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import { loadShopList } from "@/lib/loadShopList";
import { loadGenres } from "@/lib/loadGenres";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { RecommendedCampaigns } from "@/components/common/RecommendedCampaigns";
import ShopListByGenre from "@/components/sections/city/ShopListByGenre";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import { sortGenresByPriority } from "@/lib/genreSortPriority";

export default function CityPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === params.prefecture &&
      c.citySlug === params.city
  );
  if (!campaign) return notFound();

  const shopList = loadShopList(params.prefecture, params.city);
  const genres = sortGenresByPriority(
    loadGenres(params.prefecture, params.city)
  );
  const { prefecture, city, startDate, endDate, offer, fullpoint } = campaign;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
          {city}のPayPay{offer}%還元キャンペーン
        </h1>

        <CampaignSummaryCard campaign={campaign} />

        <GenreHeaderNav genres={genres} />

        <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
          <p>
            <span className="font-semibold">{prefecture}{city}</span>で
            <span className="text-brand-primary font-bold"> {formatJapaneseDate(startDate)}～{formatJapaneseDate(endDate)} </span>
            まで、{offer}％還元キャッシュレス応援キャンペーンが開催中。最大{formatNumber(fullpoint)}円分のポイントを獲得できます。
          </p>

          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-1 mt-12">
            {city}のPayPay還元キャンペーンとは？
          </h2>
          <p>
            <strong>{prefecture}{city}「{campaign.campaigntitle}」</strong> は、
            対象店舗でPayPayを利用すると <span className="text-brand-primary font-bold">{offer}％</span> が戻ってくるお得なキャンペーン。
          </p>
        </section>

        <div className="mt-10">
          <CampaignOverviewTable campaign={campaign} />
        </div>

        <div className="mt-10">
          <CampaignNotice campaign={campaign} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-1 mt-12">
          {city}の{offer}%還元キャンペーン対象店舗
        </h2>

        {/* 対象店舗リスト */}
        {!shopList ? (
          <p className="mt-10 text-gray-700 text-base">
            現時点では対象店舗情報が公表されていません。<br />
            公表されましたらこのページで紹介いたします。
          </p>
        ) : (
          <section className="mt-16 space-y-14">
            {Object.entries(shopList).map(([genre, shops]) => (
              <ShopListByGenre key={genre} genre={genre} shops={shops} />
            ))}
          </section>
        )}

        <div className="mt-20">
          <RecommendedCampaigns
            prefectureSlug={campaign.prefectureSlug}
            citySlug={campaign.citySlug}
          />
        </div>

        <BackNavigationButtons
          prefecture={campaign.prefecture}
          prefectureSlug={campaign.prefectureSlug}
        />
      </main>
    </div>
  );
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}
