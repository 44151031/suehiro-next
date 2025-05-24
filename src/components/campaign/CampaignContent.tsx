// ✅ /components/campaign/CampaignContent.tsx

import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import CampaignCard from "@/components/common/CampaignCard";

type Campaign = typeof campaigns[0];
type CampaignProps = { campaign: Campaign };
type PrefectureListProps = {
  prefectureSlug: string;
  excludeCitySlug?: string;
};

// ✅ 概要
export function CampaignSummary({ campaign }: CampaignProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900">
        {campaign.prefecture}{campaign.city} 最大{campaign.offer}%還元キャンペーン
      </h1>
      <p className="text-gray-700 text-base">
        {formatJapaneseDate(campaign.startDate, "から")}〜
        {formatJapaneseDate(campaign.endDate, "まで")} 実施されるお得なPayPayキャンペーンです。
      </p>
    </div>
  );
}

// ✅ 効率的な獲得方法
export function CampaignEfficiencyTip({ campaign }: CampaignProps) {
  return (
    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-blue-700 mb-2">効率的なポイント獲得方法</h2>
      <p className="text-blue-900">
        1回{campaign.onepay}円の買い物を{campaign.paytime}回、合計{campaign.fullpay}円使うと最大{campaign.fullpoint}円分のPayPayポイントが獲得できます。
      </p>
    </div>
  );
}

// ✅ 概要テーブル
export function CampaignOverviewTable({ campaign }: CampaignProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-xl shadow-sm mb-8 text-sm">
        <tbody>
          <tr className="bg-gray-50">
            <th className="p-3 text-left font-medium text-gray-600 w-40">対象</th>
            <td className="p-3 text-gray-800">{campaign.city}の対象店舗</td>
          </tr>
          <tr>
            <th className="p-3 text-left font-medium text-gray-600 bg-gray-50">期間</th>
            <td className="p-3 text-gray-800">
              {formatJapaneseDate(campaign.startDate, "から")} ～ {formatJapaneseDate(campaign.endDate, "まで")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <th className="p-3 text-left font-medium text-gray-600">還元率</th>
            <td className="p-3 text-gray-800">{campaign.offer}%</td>
          </tr>
          <tr>
            <th className="p-3 text-left font-medium text-gray-600 bg-gray-50">1回上限</th>
            <td className="p-3 text-gray-800">{campaign.onepoint}円</td>
          </tr>
          <tr className="bg-gray-50">
            <th className="p-3 text-left font-medium text-gray-600">期間上限</th>
            <td className="p-3 text-gray-800">{campaign.fullpoint}円</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ✅ 都道府県内 他市のキャンペーン（カード形式・レスポンシブ・除外機能付き）
export function PrefectureCampaignList({
  prefectureSlug,
  excludeCitySlug,
}: PrefectureListProps) {
  const relatedCampaigns = campaigns.filter(
    (c) => c.prefectureSlug === prefectureSlug && c.citySlug !== excludeCitySlug
  );

  if (relatedCampaigns.length === 0) return null;

  return (
    <section className="mt-12 bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          同じ都道府県で開催中のキャンペーン
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedCampaigns.map((c) => (
            <Link
              key={c.citySlug}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
              className="block hover:opacity-90"
            >
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                startDate={c.startDate}
                endDate={c.endDate}
                fullpoint={c.fullpoint}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
