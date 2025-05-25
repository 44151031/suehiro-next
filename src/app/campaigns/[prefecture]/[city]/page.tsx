import { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import {
  CampaignSummary,
  CampaignEfficiencyTip,
  CampaignOverviewTable,
  PrefectureCampaignList,
} from "@/components/sections/city/CitySummary";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";

// ✅ 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: { prefecture: string; city: string };
}): Promise<Metadata> {
  const campaign = campaigns.find(
    (c) => c.prefectureSlug === params.prefecture && c.citySlug === params.city
  );
  if (!campaign) {
    return {
      title: "キャンペーン情報が見つかりません",
      description:
        "お探しのキャンペーンは存在しないか、URLが間違っている可能性があります。",
    };
  }

  const title = `${campaign.prefecture}${campaign.city}のPayPayキャンペーン情報`;
  const description = `${formatJapaneseDate(
    campaign.startDate,
    "から"
  )} ${formatJapaneseDate(
    campaign.endDate,
    "まで"
  )} ${campaign.offer}%還元 ［付与上限］${campaign.onepoint}P／回・${campaign.fullpoint}P／期間`;

  return { title, description };
}

// ✅ ページ表示処理
export default function CityPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const campaign = campaigns.find(
    (c) => c.prefectureSlug === params.prefecture && c.citySlug === params.city
  );
  if (!campaign) return notFound();

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6">
          {campaign.prefecture}{campaign.city}のPayPayキャンペーン
        </h1>
<CampaignSummaryCard campaign={campaign} />
        {/* キャンペーン概要・効率・表 */}
        <CampaignSummary campaign={campaign} />
        <CampaignEfficiencyTip campaign={campaign} />
        <CampaignOverviewTable campaign={campaign} />

        {/* 他の市区町村の一覧 */}
        <PrefectureCampaignList
          prefectureSlug={campaign.prefectureSlug}
          excludeCitySlug={campaign.citySlug}
        />

        {/* 戻るリンク */}
        <div className="mt-12 flex flex-col sm:flex-row sm:justify-end gap-3">
          <a
            href={`/campaigns/${campaign.prefectureSlug}`}
            className="inline-block bg-white text-primary border border-border rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent/10 transition"
          >
            {campaign.prefecture}のキャンペーン一覧へ戻る
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
