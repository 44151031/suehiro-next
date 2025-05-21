import { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import {
  CampaignSummary,
  CampaignEfficiencyTip,
  CampaignOverviewTable,
  PrefectureCampaignList,
} from "@/components/campaign/CampaignContent";

// ✅ 動的メタデータ生成
export async function generateMetadata({ params }: { params: { prefecture: string; city: string } }): Promise<Metadata> {
  const campaign = campaigns.find(c => c.prefectureSlug === params.prefecture && c.citySlug === params.city);
  if (!campaign) {
    return {
      title: "キャンペーン情報が見つかりません",
      description: "お探しのキャンペーンは存在しないか、URLが間違っている可能性があります。",
    };
  }

  const title = `${campaign.prefecture}${campaign.city}のPayPayキャンペーン情報`;
  const description = `${formatJapaneseDate(campaign.startDate, "から")} ${formatJapaneseDate(campaign.endDate, "まで")} ${campaign.offer} ［付与上限］${campaign.onepoint}P／回・${campaign.fullpoint}P／期間`;

  return { title, description };
}

// ✅ ページ表示処理
export default function CityPage({ params }: { params: { prefecture: string; city: string } }) {
  const campaign = campaigns.find(c => c.prefectureSlug === params.prefecture && c.citySlug === params.city);
  if (!campaign) return notFound();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <CampaignSummary campaign={campaign} />
      <CampaignEfficiencyTip campaign={campaign} />
      <CampaignOverviewTable campaign={campaign} />
      <PrefectureCampaignList prefectureSlug={campaign.prefectureSlug} />

      <div className="mt-8">
        <a href={`/campaigns/${campaign.prefectureSlug}`} className="text-blue-500 underline block mb-2">
          {campaign.prefecture}のキャンペーン一覧へ戻る
        </a>
        <a href="/" className="text-blue-500 underline block">
          トップページへ戻る
        </a>
      </div>
    </div>
  );
}
