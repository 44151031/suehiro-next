import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { RecommendedCampaigns } from "@/components/common/RecommendedCampaigns";

export default function CityPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const campaign = campaigns.find(
    (c) => c.prefectureSlug === params.prefecture && c.citySlug === params.city
  );
  if (!campaign) return notFound();

  const { prefecture, city, startDate, endDate, offer, fullpoint } = campaign;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6">
          {prefecture}{city}のPayPayキャンペーン
        </h1>

        {/* サマリーカード */}
        <CampaignSummaryCard campaign={campaign} />

        {/* リード文・説明 */}
        <div className="mt-8 text-base text-gray-800 space-y-4 leading-relaxed">
          <p>
            {prefecture}{city}で{formatJapaneseDate(startDate)}～{formatJapaneseDate(endDate)}まで
            {offer}％還元キャッシュレス応援キャンペーン開催。最大{formatNumber(fullpoint)}円分のポイントを獲得できます。
            このページではポイントを獲得しやすいように、PayPayが使えるお店をジャンルに分けてキャンペーン対象店舗をご紹介します。
          </p>

          <h2 className="mt-12 text-xl sm:text-2xl font-extrabold text-neutral-800 border-l-4 border-brand-primary pl-4">
            {city}のPayPay還元キャンペーンとは？
          </h2>
          <p>
            {prefecture}{city}「物価高騰に負けるな{city}！～対象店舗でPayPayを利用すると最大{offer}％が戻ってくるキャンペーン～」は、
            対象店舗でPayPayを用いた決済を行うことで、決済金額の最大{offer}％のPayPayボーナスが付与されるとてもお得なキャンペーンです。
          </p>
        </div>

        {/* 概要テーブル */}
        <div className="mt-8">
          <CampaignOverviewTable campaign={campaign} />
        </div>

        {/* おすすめキャンペーン（同県内→近県） */}
        <div className="mt-16">
          <RecommendedCampaigns
            prefectureSlug={campaign.prefectureSlug}
            citySlug={campaign.citySlug}
          />
        </div>

        {/* 戻るリンク */}
        <div className="mt-12 flex flex-col sm:flex-row sm:justify-end gap-3">
          <a
            href={`/campaigns/${campaign.prefectureSlug}`}
            className="inline-block bg-white text-primary border border-border rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent/10 transition"
          >
            {prefecture}のキャンペーン一覧へ戻る
          </a>
          <a
            href="/"
            className="inline-block bg-white text-primary border border-border rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent/10 transition"
          >
            トップページへ戻る
          </a>
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}
