import Link from "next/link";
import { campaigns } from "@/lib/campaigns";

type Campaign = typeof campaigns[0];
type CampaignProps = { campaign: Campaign };
type PrefectureListProps = { prefectureSlug: string };

// ✅ 概要コンポーネント
export function CampaignSummary({ campaign }: CampaignProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4">{campaign.prefecture}{campaign.city} {campaign.offer}キャンペーン</h1>
      <p>{campaign.start}から{campaign.period}まで実施されるお得なPayPayキャンペーンです。</p>
    </div>
  );
}

// ✅ 効率的な獲得方法
export function CampaignEfficiencyTip({ campaign }: CampaignProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">効率的なポイント獲得方法</h2>
      <p>1回{campaign.onepay}円の買い物を{campaign.paytime}回、合計{campaign.fullpay}円使うと最大{campaign.fullpoint}円分のボーナスが獲得できます。</p>
    </div>
  );
}

// ✅ 概要表
export function CampaignOverviewTable({ campaign }: CampaignProps) {
  return (
    <table className="w-full border border-gray-300 mb-6">
      <tbody>
        <tr><th className="p-2 border">キャンペーン対象</th><td className="p-2 border">{campaign.city}の対象店舗</td></tr>
        <tr><th className="p-2 border">キャンペーン期間</th><td className="p-2 border">{campaign.start} ～ {campaign.period}</td></tr>
        <tr><th className="p-2 border">還元率</th><td className="p-2 border">{campaign.offer}</td></tr>
        <tr><th className="p-2 border">1回上限</th><td className="p-2 border">{campaign.onepoint}円</td></tr>
        <tr><th className="p-2 border">期間上限</th><td className="p-2 border">{campaign.fullpoint}円</td></tr>
      </tbody>
    </table>
  );
}

// ✅ 都道府県内キャンペーン一覧
export function PrefectureCampaignList({ prefectureSlug }: PrefectureListProps) {
  const relatedCampaigns = campaigns.filter(c => c.prefectureSlug === prefectureSlug);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">同じ都道府県の開催中キャンペーン</h2>
      <ul className="space-y-2">
        {relatedCampaigns.map(c => (
          <li key={c.citySlug}>
            <Link href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`} className="text-blue-500 underline">
              {c.prefecture}{c.city} {c.offer}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}