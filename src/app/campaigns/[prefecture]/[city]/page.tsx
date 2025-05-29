import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { RecommendedCampaigns } from "@/components/common/RecommendedCampaigns";
import { loadShopList } from "@/lib/loadShopList";
import { loadGenres } from "@/lib/loadGenres";
import ShopListByGenre from "@/components/sections/city/ShopListByGenre";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import Link from "next/link";

export default function CityPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const campaign = campaigns.find(
    (c) => c.prefectureSlug === params.prefecture && c.citySlug === params.city
  );
  if (!campaign) return notFound();

  const shopList = loadShopList(params.prefecture, params.city);
  const genres = loadGenres(params.prefecture, params.city);
  const { prefecture, city, startDate, endDate, offer, fullpoint } = campaign;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">

      <main className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
          {prefecture}{city}のPayPayキャンペーン
        </h1>

        {/* サマリーカード */}
        <CampaignSummaryCard campaign={campaign} />

        {/* 🔻 スティッキージャンルナビ（ジャンルがなくても表示） */}
        <GenreHeaderNav genres={genres} />

        {/* リード文・説明 */}
        <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
          <p>
            <span className="font-semibold">{prefecture}{city}</span>で
            <span className="text-brand-primary font-bold"> {formatJapaneseDate(startDate)}～{formatJapaneseDate(endDate)} </span>
            まで、{offer}％還元キャッシュレス応援キャンペーンが開催中。最大{formatNumber(fullpoint)}円分のポイントを獲得できます。
            このページではポイントを獲得しやすいように、PayPayが使えるお店をジャンルごとにご紹介します。
          </p>

          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-300 pb-1 mt-12">
            {city}のPayPay還元キャンペーンとは？
          </h2>
          <p>
            <strong>{prefecture}{city}「{campaign.campaigntitle}」</strong> は、
            対象店舗でPayPayを利用すると <span className="text-brand-primary font-bold">{offer}％</span> が戻ってくるお得なキャンペーン。
            賢くお買い物してポイントをしっかりゲットしましょう。
          </p>
        </section>

        {/* 概要テーブル */}
        <div className="mt-10">
          <CampaignOverviewTable campaign={campaign} />
        </div>

        {/* キャンペーン注意書き */}
        <div className="mt-10">
          <CampaignNotice campaign={campaign} />
        </div>

        {/* 対象店舗リスト */}
        {shopList && (
          <section className="mt-16 space-y-14">
            {Object.entries(shopList).map(([genre, shops]) => (
              <ShopListByGenre key={genre} genre={genre} shops={shops} />
            ))}
          </section>
        )}

        {/* おすすめキャンペーン */}
        <div className="mt-20">
          <RecommendedCampaigns
            prefectureSlug={campaign.prefectureSlug}
            citySlug={campaign.citySlug}
          />
        </div>

        {/* 戻るリンク */}
        <div className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <a
            href="/campaigns/kanagawa"
            className="inline-block bg-white text-[#f7931e] border border-[#f7931e] text-base font-bold px-6 py-3 rounded-full shadow hover:bg-[#f7931e] hover:text-white transition-colors"
          >
            神奈川県のキャンペーン一覧へ戻る
          </a>
          <a
            href="/campaigns"
            className="inline-block bg-white text-[#f7931e] border border-[#f7931e] text-base font-bold px-6 py-3 rounded-full shadow hover:bg-[#f7931e] hover:text-white transition-colors"
          >
            全国のキャンペーン一覧を見る
          </a>
          <a
            href="/"
            className="inline-block bg-white text-[#f7931e] border border-[#f7931e] text-base font-bold px-6 py-3 rounded-full shadow hover:bg-[#f7931e] hover:text-white transition-colors"
          >
            トップページへ戻る
          </a>
        </div>
      </main>
    </div>
  );
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}
